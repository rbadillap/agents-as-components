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
import {
  extractSessionContext,
  SessionContext,
} from "@/lib/session-context";

type Message = InferAgentUIMessage<typeof orchestratorAgent>;

type AgentMode = {
  mode: "active" | "focus";
  reason: string | null;
  isDefault: boolean;
};

type ActiveAgent = {
  name: string | null;
  displayName: string | null;
};

const AGENT_DISPLAY_NAMES: Record<string, string> = {
  delegateWeather: "Weather",
  delegateCalculator: "Calculator",
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
const ActiveAgentContext = createContext<ActiveAgent | null>(null);
const SessionContextContext = createContext<SessionContext | null>(null);

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

  // Derive active agent from messages - find currently executing delegation tool
  const activeAgent = useMemo<ActiveAgent>(() => {
    // Check last assistant message for executing tools
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role !== "assistant") continue;

      for (const part of message.parts) {
        if (isToolUIPart(part)) {
          const toolName = getToolName(part);
          const isExecuting =
            part.state === "input-streaming" || part.state === "input-available";

          if (isExecuting && AGENT_DISPLAY_NAMES[toolName]) {
            return {
              name: toolName,
              displayName: AGENT_DISPLAY_NAMES[toolName],
            };
          }
        }
      }
      break; // Only check the last assistant message
    }
    return { name: null, displayName: null };
  }, [messages]);

  // Derive session context from messages - extract all rememberFact outputs
  const sessionContext = useMemo<SessionContext>(
    () => extractSessionContext(messages),
    [messages]
  );

  const orchestratorValue = useMemo(
    () => ({ messages, sendMessage, status, isLoading }),
    [messages, sendMessage, status, isLoading]
  );

  return (
    <OrchestratorContext.Provider value={orchestratorValue}>
      <AgentModeContext.Provider value={agentMode}>
        <ActiveAgentContext.Provider value={activeAgent}>
          <SessionContextContext.Provider value={sessionContext}>
            {children}
          </SessionContextContext.Provider>
        </ActiveAgentContext.Provider>
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

// Separate hook - only re-renders when activeAgent changes
export function useActiveAgent() {
  const context = useContext(ActiveAgentContext);
  if (!context) {
    throw new Error("useActiveAgent must be used within OrchestratorProvider");
  }
  return context;
}

// Separate hook - only re-renders when sessionContext changes
export function useSessionContext() {
  const context = useContext(SessionContextContext);
  if (!context) {
    throw new Error(
      "useSessionContext must be used within OrchestratorProvider"
    );
  }
  return context;
}
