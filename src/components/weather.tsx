"use client";

import { ChatAgent } from "./chat-agent";

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
    <ChatAgent
      api="/api/agents/weather"
      placeholder={placeholder}
      className={className}
      loadingText="Checking weather..."
      emptyTitle="Weather assistant"
      emptyDescription="Ask me about weather in any city"
    />
  );
}
