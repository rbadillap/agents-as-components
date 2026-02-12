"use client";

import { DefaultChatTransport, InferAgentUIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useMemo, useCallback } from "react";
import type { calculatorAgent } from "@/agents/calculator";
import { MessageParts } from "./message-parts";

type Message = InferAgentUIMessage<typeof calculatorAgent>;

type CalculatorProps = {
  /** Custom instructions to override the default agent behavior */
  instructions?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Calculator Component
 *
 * A React component that provides a chat interface to the calculator agent.
 *
 * @example
 * <Calculator />
 *
 * @example
 * <Calculator
 *   instructions="You are a math tutor. Explain each step clearly."
 *   placeholder="Enter a math problem..."
 * />
 */
export function Calculator({
  instructions,
  placeholder = "Ask a math question...",
  className,
}: CalculatorProps) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agents/calculator",
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
                ? "bg-green-100 dark:bg-green-900 ml-8"
                : "bg-neutral-100 dark:bg-neutral-800 mr-8"
            }`}
          >
            <MessageParts message={message} />
          </div>
        ))}
        {isLoading && (
          <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 mr-8">
            <p className="animate-pulse">Calculating...</p>
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
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
