# Agents Guide

## Pattern: Agent as Component

Each agent has two parts:
1. **Server** (`src/agents/*.ts`) - ToolLoopAgent with tools
2. **Client** (`src/components/`) - React component(s) with Provider pattern

For simple agents: single file component with useChat.
For complex agents: folder with Provider, hooks, and composable pieces.

## Creating a New Agent

### Simple Agent (single file)

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

### Complex Agent (folder with Provider)

For agents with derived state or composable UI, use the folder pattern:

```
src/components/{name}/
├── context.tsx        # Provider + hooks
├── messages.tsx       # Message display component
├── input.tsx          # Input component
└── index.tsx          # Barrel exports + composed component
```

See `src/components/orchestrator/` for the reference implementation.

## Current Agents

| Agent | Type | Features |
|-------|------|----------|
| `weather` | Simple | Weather lookup, temperature conversion |
| `calculator` | Simple | Math calculations |
| `orchestrator` | Complex | Subagent delegation, memory, modes, Provider pattern |

## Agent State via Tool Outputs

Agent state persists via tool outputs in message history. The client derives state by scanning messages.

**Memory** (`rememberFact` tool):
```ts
execute: async ({ category, fact }) => ({ stored: true, category, fact })
```

**Modes** (`setMode` tool):
```ts
execute: async ({ mode, reason }) => ({ mode, reason, timestamp: Date.now() })
```

The client hook derives current mode:
```ts
const agentMode = useMemo(() => {
  // Scan messages backwards for most recent setMode output
  for (let i = messages.length - 1; i >= 0; i--) { ... }
  return { mode: "active", reason: null, isDefault: true };
}, [messages]);
```

## Hooks Pattern

Complex agents expose hooks for accessing state:

```tsx
// From context.tsx
export const useOrchestrator = () => useContext(OrchestratorContext);
export const useAgentMode = () => useOrchestrator().agentMode;

// Usage in any child component
function ModeIndicator() {
  const { mode, reason } = useAgentMode();
  return <div>{mode}: {reason}</div>;
}
```

This enables standalone components that access agent state without prop drilling.
