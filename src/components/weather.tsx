"use client";

import { InferAgentUIMessage } from "ai";
import type { weatherAgent } from "@/agents/weather";
import { ChatAgent } from "./chat-agent";

type Message = InferAgentUIMessage<typeof weatherAgent>;

type WeatherProps = {
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Weather Component
 *
 * A React component that provides a chat interface to the weather agent.
 *
 * @example
 * <Weather />
 *
 * @example
 * <Weather placeholder="Enter a city..." />
 */
export function Weather({
  placeholder = "Ask about weather...",
  className,
}: WeatherProps) {
  return (
    <ChatAgent<Message>
      api="/api/agents/weather"
      placeholder={placeholder}
      className={className}
      userMessageClass="bg-blue-100 dark:bg-blue-900 ml-8"
      buttonClass="bg-blue-600"
      loadingText="Thinking..."
    />
  );
}
