# AI SDK Agents Project

## Stack
- Next.js 16 (App Router, Turbopack)
- AI SDK 6.x (`ai`, `@ai-sdk/react`, `@ai-sdk/gateway`)
- TypeScript, Tailwind CSS 4

## Architecture

```
src/agents/      → Server: ToolLoopAgent definitions
src/components/  → Client: "use client" React components with useChat
src/app/api/     → API routes using createAgentUIStreamResponse
```

## Key Patterns

**Agent definition** (server):
```ts
export const myAgent = new ToolLoopAgent({
  model: gateway("anthropic/claude-sonnet-4"),
  instructions: "...",
  tools: { myTool },
});
```

**Component** (client):
```tsx
const { messages, sendMessage, status } = useChat<Message>({
  transport: new DefaultChatTransport({ api: "/api/agents/my-agent" }),
});
```

**Subagent delegation** (tool that calls another agent):
```ts
const delegateTool = tool({
  description: "Delegate to specialist",
  inputSchema: z.object({ task: z.string() }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await subAgent.generate({ prompt: task, abortSignal });
    return result.text;
  },
});
```

## Commands
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm typecheck` - Type checking

## Environment
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway key

## Session Memory Pattern

AI SDK provides `experimental_context`, `onStepFinish`, and `onFinish` for state management, but these are **per-request** - they don't persist between HTTP requests.

**Solution**: Memory via tool + message history

```ts
const rememberFactTool = tool({
  description: "Remember an important fact the user shared",
  inputSchema: z.object({
    category: z.enum(["name", "preference", "location", "other"]),
    fact: z.string(),
  }),
  execute: async ({ category, fact }) => {
    return { stored: true, category, fact };
  },
});
```

The fact is stored in the tool result, which lives in the message history. The LLM "sees" it in subsequent turns because the full history is re-sent with each request.

This pattern keeps memory **implicit** (in history) rather than requiring external storage.
