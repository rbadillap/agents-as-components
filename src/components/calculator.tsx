"use client";

import { InferAgentUIMessage } from "ai";
import type { calculatorAgent } from "@/agents/calculator";
import { ChatAgent } from "./chat-agent";

type Message = InferAgentUIMessage<typeof calculatorAgent>;

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
    <ChatAgent<Message>
      api="/api/agents/calculator"
      placeholder={placeholder}
      className={className}
      userMessageClass="bg-green-100 dark:bg-green-900 ml-8"
      buttonClass="bg-green-600"
      loadingText="Calculating..."
    />
  );
}
