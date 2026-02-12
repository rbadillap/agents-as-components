"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import {
  DefaultChatTransport,
  InferAgentUIMessage,
  isToolUIPart,
  getToolName,
} from "ai";
import { useChat } from "@ai-sdk/react";
import type { orchestratorAgent } from "@/agents/orchestrator";

type Message = InferAgentUIMessage<typeof orchestratorAgent>;

type AgentMode = {
  mode: "active" | "focus";
  reason: string | null;
  isDefault: boolean;
};

type OrchestratorContextValue = {
  messages: Message[];
  sendMessage: (params: { text: string }) => void;
  status: string;
  isLoading: boolean;
};

// Separate contexts to avoid unnecessary re-renders (rerender-derived-state)
const OrchestratorContext = createContext<OrchestratorContextValue | null>(
  null
);
const AgentModeContext = createContext<AgentMode | null>(null);

export function OrchestratorProvider({ children }: { children: ReactNode }) {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agents/orchestrator" }),
    []
  );

  const { messages, sendMessage, status } = useChat<Message>({ transport });
  const isLoading = status === "submitted" || status === "streaming";

  // Derive mode from messages - scan backwards for most recent setMode tool call
  const agentMode = useMemo<AgentMode>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role !== "assistant") continue;

      for (let j = message.parts.length - 1; j >= 0; j--) {
        const part = message.parts[j];
        if (
          isToolUIPart(part) &&
          getToolName(part) === "setMode" &&
          part.state === "output-available"
        ) {
          const output = part.output as {
            mode: "active" | "focus";
            reason: string;
          };
          return { mode: output.mode, reason: output.reason, isDefault: false };
        }
      }
    }
    return { mode: "active", reason: null, isDefault: true };
  }, [messages]);

  const orchestratorValue = useMemo(
    () => ({ messages, sendMessage, status, isLoading }),
    [messages, sendMessage, status, isLoading]
  );

  return (
    <OrchestratorContext.Provider value={orchestratorValue}>
      <AgentModeContext.Provider value={agentMode}>
        {children}
      </AgentModeContext.Provider>
    </OrchestratorContext.Provider>
  );
}

export function useOrchestrator() {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error("useOrchestrator must be used within OrchestratorProvider");
  }
  return context;
}

// Separate hook - only re-renders when agentMode changes
export function useAgentMode() {
  const context = useContext(AgentModeContext);
  if (!context) {
    throw new Error("useAgentMode must be used within OrchestratorProvider");
  }
  return context;
}
