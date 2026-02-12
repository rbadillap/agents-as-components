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

**Component with Provider** (client):
```tsx
// Provider encapsulates useChat, exposes hooks
export function MyAgentProvider({ children }) {
  const { messages, sendMessage, status } = useChat<Message>({ transport });
  const derivedState = useMemo(() => deriveFromMessages(messages), [messages]);
  return <Context.Provider value={{ messages, sendMessage, derivedState }}>{children}</Context.Provider>;
}

// Hooks for accessing agent state
export const useMyAgent = () => useContext(Context);
export const useDerivedState = () => useMyAgent().derivedState;
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

## State Patterns

### Tool Output as State

Agent state (memory, modes) is stored via tool outputs in message history. The client derives state by scanning messages for specific tool results.

```ts
// Server: tool stores state in its output
const setModeTool = tool({
  inputSchema: z.object({ mode: z.enum(["active", "focus"]), reason: z.string() }),
  execute: async ({ mode, reason }) => ({ mode, reason, timestamp: Date.now() }),
});

// Client: derive state from messages
const agentMode = useMemo(() => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const part = findToolOutput(messages[i], "setMode");
    if (part) return { mode: part.output.mode, reason: part.output.reason };
  }
  return { mode: "active", reason: null }; // default
}, [messages]);
```

### Composable Components via Folder Structure

Complex agents use a folder with Provider pattern:

```
src/components/orchestrator/
├── context.tsx        # Provider + useOrchestrator + useAgentMode hooks
├── messages.tsx       # <OrchestratorMessages /> uses hook
├── input.tsx          # <OrchestratorInput /> uses hook
├── mode-indicator.tsx # <ModeIndicator /> uses useAgentMode()
└── index.tsx          # Barrel exports + composed <Orchestrator />
```

Usage: simple `<Orchestrator />` or composable with Provider + individual pieces.

### Shared Context (Orchestrator → Subagents)

Context is shared deterministically (code, not LLM) from orchestrator to subagents.

```
src/lib/session-context.ts           ← Shared extraction logic
  ├─ extractSessionContext(messages) → { name, location, preferences, other }
  └─ formatContextPrefix(context)    → "[User: Ronny | Location: Madrid] "
```

**Server-side injection** (in delegate tools):
```ts
execute: async ({ task }, { abortSignal, messages }) => {
  const context = extractSessionContext(messages);
  const prompt = formatContextPrefix(context) + task;
  const result = await subAgent.generate({ prompt, abortSignal });
  return result.text;
}
```

**Client-side hook**:
```ts
const context = useSessionContext();
// { name: "Ronny", location: "Madrid", preferences: [], other: [] }
```
