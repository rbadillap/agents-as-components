import { createAgentUIStreamResponse } from "ai";
import { orchestratorAgent } from "@/agents/orchestrator";

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: orchestratorAgent,
    uiMessages: messages,
  });
}
