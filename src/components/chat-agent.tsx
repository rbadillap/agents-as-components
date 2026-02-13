"use client";

import { DefaultChatTransport, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useMemo, useCallback } from "react";
import { MessageParts } from "./message-parts";
import { ChatInput, ChatBubble, ChatEmpty, ChatContainer } from "./chat";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type ChatAgentProps = {
  /** API endpoint for the agent */
  api: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading text */
  loadingText?: string;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
};

/**
 * Base Chat Agent Component
 *
 * Reusable chat interface for any agent. Uses the shared chat
 * components for consistent UI and accessibility.
 */
export function ChatAgent({
  api,
  placeholder = "Type a message...",
  className,
  loadingText = "Thinking...",
  emptyTitle = "Start chatting",
  emptyDescription = "Send a message to begin",
}: ChatAgentProps) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api }),
    [api]
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }, [input, sendMessage]);

  const hasMessages = messages.length > 0;

  return (
    <div className={cn("flex flex-col", className)}>
      {!hasMessages && !isLoading ? (
        <ChatEmpty title={emptyTitle} description={emptyDescription} />
      ) : (
        <ChatContainer className="flex-1 min-h-0">
          {messages.map((message) => (
            <ChatBubble key={message.id} role={message.role}>
              <MessageParts message={message} />
            </ChatBubble>
          ))}
          {isLoading && (
            <ChatBubble role="assistant">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <span className="text-sm text-muted-foreground animate-pulse">
                  {loadingText}
                </span>
              </div>
            </ChatBubble>
          )}
        </ChatContainer>
      )}

      <div className="mt-auto pt-3 border-t">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
