"use client";

import { useOrchestrator } from "./context";
import { MessageParts } from "../message-parts";
import { ChatBubble, ChatEmpty, ChatContainer } from "@/components/chat";

export function OrchestratorMessages() {
  const { messages } = useOrchestrator();

  return (
    <ChatContainer className="flex-1 min-h-0">
      <div className="max-w-2xl mx-auto space-y-6 min-h-full flex flex-col">
        {messages.length === 0 ? (
          <ChatEmpty
            title="What can I help you with?"
            description="Ask about weather or do calculations"
            className="flex-1"
          />
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} role={message.role}>
              <MessageParts message={message} />
            </ChatBubble>
          ))
        )}
      </div>
    </ChatContainer>
  );
}
