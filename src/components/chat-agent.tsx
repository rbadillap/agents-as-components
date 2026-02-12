"use client";

import { DefaultChatTransport, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useMemo, useCallback, ReactNode } from "react";
import { MessageParts } from "./message-parts";

type ChatAgentProps<TMessage extends UIMessage> = {
  /** API endpoint for the agent */
  api: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Color theme for user messages */
  userMessageClass?: string;
  /** Color theme for submit button */
  buttonClass?: string;
  /** Loading text */
  loadingText?: string;
};

// Hoisted static JSX (rendering-hoist-jsx)
const assistantMessageClass = "bg-neutral-100 dark:bg-neutral-800 mr-8";

/**
 * Base Chat Agent Component
 *
 * Reusable chat interface for any agent. Reduces duplication across
 * Weather, Calculator, and other simple agent components.
 */
export function ChatAgent<TMessage extends UIMessage>({
  api,
  placeholder = "Type a message...",
  className,
  userMessageClass = "bg-blue-100 dark:bg-blue-900 ml-8",
  buttonClass = "bg-blue-600",
  loadingText = "Thinking...",
}: ChatAgentProps<TMessage>) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api }),
    [api]
  );

  const { messages, sendMessage, status } = useChat<TMessage>({ transport });

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
              message.role === "user" ? userMessageClass : assistantMessageClass
            }`}
          >
            <MessageParts message={message} />
          </div>
        ))}
        {isLoading && (
          <div className={`p-2 rounded ${assistantMessageClass}`}>
            <p className="animate-pulse">{loadingText}</p>
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
          className={`px-4 py-2 ${buttonClass} text-white rounded disabled:opacity-50`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
