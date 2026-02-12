import { createAgentUIStreamResponse } from "ai";
import { createCalculatorAgent, calculatorAgent } from "@/agents/calculator";

export async function POST(request: Request) {
  const { messages, instructions } = await request.json();

  // Use custom instructions if provided, otherwise use default agent
  const agent = instructions
    ? createCalculatorAgent(instructions)
    : calculatorAgent;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
