import { createAgentUIStreamResponse } from "ai";
import { createAssistantAgent, assistantAgent } from "@/agents/assistant";

export async function POST(request: Request) {
  const { messages, instructions } = await request.json();

  // VULNERABLE: Accepts arbitrary instructions from client
  const agent = instructions
    ? createAssistantAgent(instructions)
    : assistantAgent;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
