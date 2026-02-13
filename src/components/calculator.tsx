"use client";

import { ChatAgent } from "./chat-agent";

type CalculatorProps = {
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
 * <Calculator placeholder="Enter a math problem..." />
 */
export function Calculator({
  placeholder = "Ask a math question...",
  className,
}: CalculatorProps) {
  return (
    <ChatAgent
      api="/api/agents/calculator"
      placeholder={placeholder}
      className={className}
      loadingText="Calculating..."
      emptyTitle="Math assistant"
      emptyDescription="Ask me any math question"
    />
  );
}
