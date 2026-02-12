"use client";

import { DefaultChatTransport, InferAgentUIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useMemo, useCallback } from "react";
import type { orchestratorAgent } from "@/agents/orchestrator";

type Message = InferAgentUIMessage<typeof orchestratorAgent>;

type OrchestratorProps = {
  /** Custom instructions to override the default agent behavior */
  instructions?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Orchestrator Component
 *
 * A React component that provides a chat interface to the orchestrator agent.
 * The orchestrator delegates tasks to weather and calculator specialists.
 *
 * @example
 * <Orchestrator />
 *
 * @example
 * <Orchestrator
 *   instructions="Always explain which specialist you're using."
 *   placeholder="Ask anything..."
 * />
 */
export function Orchestrator({
  instructions,
  placeholder = "Ask about weather or math...",
  className,
}: OrchestratorProps) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agents/orchestrator",
        body: instructions ? { instructions } : undefined,
      }),
    [instructions]
  );

  const { messages, sendMessage, status } = useChat<Message>({ transport });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, sendMessage]
  );

  return (
    <div className={className}>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded ${
              message.role === "user"
                ? "bg-purple-100 dark:bg-purple-900 ml-8"
                : "bg-neutral-100 dark:bg-neutral-800 mr-8"
            }`}
          >
            {message.parts.map((part, i) =>
              part.type === "text" ? <p key={i}>{part.text}</p> : null
            )}
          </div>
        ))}
        {isLoading && (
          <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 mr-8">
            <p className="animate-pulse">Coordinating specialists...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
