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
- `weather` - Weather lookup with temperature conversion
- `calculator` - Math calculations
- `orchestrator` - Delegates to weather/calculator subagents
