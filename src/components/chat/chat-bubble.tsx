"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  /** Message role determines styling (system renders as assistant) */
  role: "user" | "assistant" | "system";
  /** Content to render inside the bubble */
  children: ReactNode;
  /** Additional class names */
  className?: string;
};

/**
 * Minimalist chat bubble component.
 */
export const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  function ChatBubble({ role, children, className }, ref) {
    const isUser = role === "user";

    return (
      <div
        ref={ref}
        className={cn(
          "font-mono text-sm",
          isUser ? "text-foreground" : "text-muted-foreground",
          className
        )}
        data-role={role}
      >
        {children}
      </div>
    );
  }
);
