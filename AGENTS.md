# Agents Guide

## Pattern: Agent as Component

Each agent has two parts:
1. **Server** (`src/agents/*.ts`) - ToolLoopAgent with tools
2. **Client** (`src/components/*.tsx`) - React component with useChat

## Creating a New Agent

1. Create `src/agents/{name}.ts`:
```ts
import { gateway } from "@ai-sdk/gateway";
import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";

export const myTool = tool({
  description: "What the tool does",
  inputSchema: z.object({ /* params */ }),
  execute: async (input) => { /* logic */ },
});

export const myAgent = new ToolLoopAgent({
  id: "my-agent",
  model: gateway("anthropic/claude-sonnet-4"),
  instructions: "System prompt here",
  tools: { myTool },
});
```

2. Create `src/components/{name}.tsx`:
```tsx
"use client";
import { DefaultChatTransport, InferAgentUIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import type { myAgent } from "@/agents/{name}";

type Message = InferAgentUIMessage<typeof myAgent>;

export function MyComponent() {
  const { messages, sendMessage, status } = useChat<Message>({
    transport: new DefaultChatTransport({ api: "/api/agents/{name}" }),
  });
  // render UI
}
```

3. Create `src/app/api/agents/{name}/route.ts`:
```ts
import { createAgentUIStreamResponse } from "ai";
import { myAgent } from "@/agents/{name}";

export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: myAgent, uiMessages: messages });
}
```

## Current Agents
- `weather` - Weather lookup with temperature conversion (simple, stateless)
- `calculator` - Math calculations (simple, stateless)
- `orchestrator` - Delegates to subagents + session memory

## Session Memory

The orchestrator implements explicit memory via a `rememberFact` tool:

```ts
const rememberFactTool = tool({
  description: "Remember an important fact the user shared",
  inputSchema: z.object({
    category: z.enum(["name", "preference", "location", "other"]),
    fact: z.string(),
  }),
  execute: async ({ category, fact }) => ({ stored: true, category, fact }),
});
```

**Why not use AI SDK's built-in options?**

The SDK provides `experimental_context`, `onStepFinish`, and `onFinish` - but these are **per-request** callbacks. They reset with each HTTP request, so data doesn't persist across conversation turns.

**How the tool approach works:**
1. Agent detects important info ("My name is Carlos")
2. Calls `rememberFact({ category: "name", fact: "Carlos" })`
3. Tool result is stored in message history
4. On next request, full history is re-sent → LLM "sees" the remembered fact
5. Agent uses it naturally ("Carlos, the weather in Madrid is...")

**Architecture decision:** Keep subagents simple/stateless, orchestrator handles complexity (routing + memory).
