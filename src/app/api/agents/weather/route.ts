import { createAgentUIStreamResponse } from "ai";
import { weatherAgent } from "@/agents/weather";

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: weatherAgent,
    uiMessages: messages,
  });
}
