"use client";

import { useOrchestrator } from "./context";
import { MessageParts } from "../message-parts";

export function OrchestratorMessages() {
  const { messages, isLoading } = useOrchestrator();

  return (
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
          <MessageParts message={message} />
        </div>
      ))}
      {isLoading && (
        <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 mr-8">
          <p className="animate-pulse">Coordinating specialists...</p>
        </div>
      )}
    </div>
  );
}
