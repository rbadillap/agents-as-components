import { createAgentUIStreamResponse } from "ai";
import { createWeatherAgent, weatherAgent } from "@/agents/weather";

export async function POST(request: Request) {
  const { messages, instructions } = await request.json();

  // Use custom instructions if provided, otherwise use default agent
  const agent = instructions ? createWeatherAgent(instructions) : weatherAgent;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
