import { createAgentUIStreamResponse } from "ai";
import {
  createOrchestratorAgent,
  orchestratorAgent,
} from "@/agents/orchestrator";

export async function POST(request: Request) {
  const { messages, instructions } = await request.json();

  // Use custom instructions if provided, otherwise use default agent
  const agent = instructions
    ? createOrchestratorAgent(instructions)
    : orchestratorAgent;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
