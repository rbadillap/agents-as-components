import { createAgentUIStreamResponse } from "ai";
import { calculatorAgent } from "@/agents/calculator";

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: calculatorAgent,
    uiMessages: messages,
  });
}
