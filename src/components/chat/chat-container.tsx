"use client";

import { forwardRef, type ReactNode, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ChatContainerProps = {
  /** Messages content */
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Auto-scroll to bottom on new content */
  autoScroll?: boolean;
};

/**
 * Container component for chat messages with scroll area.
 * Handles auto-scrolling and provides consistent layout.
 */
export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  function ChatContainer({ children, className, autoScroll = true }, ref) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (autoScroll && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    return (
      <ScrollArea
        ref={ref}
        className={cn("flex-1", className)}
      >
        <div
          ref={scrollRef}
          className="flex flex-col gap-3 p-4"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {children}
        </div>
      </ScrollArea>
    );
  }
);
