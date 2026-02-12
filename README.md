# AI SDK Agents Explorer

Exploring composable AI agents with Vercel AI SDK.

## The Pattern

**Idea**: An AI agent can be treated like a React component - encapsulated, reusable, and composable. Complex agents use Provider pattern with hooks for derived state.

```
src/
├── agents/              # Server: ToolLoopAgent definitions
│   ├── weather.ts
│   ├── calculator.ts
│   └── orchestrator.ts  # + setMode, rememberFact tools
├── components/          # Client: React components
│   ├── weather.tsx      # Simple: single file
│   ├── calculator.tsx
│   └── orchestrator/    # Complex: Provider + hooks
│       ├── context.tsx  # useOrchestrator, useAgentMode
│       ├── messages.tsx
│       ├── input.tsx
│       ├── mode-indicator.tsx
│       └── index.tsx
└── app/api/agents/      # API routes
```

## Quick Start

```bash
# Install
pnpm install

# Add your API key
echo "AI_GATEWAY_API_KEY=your_key" > .env.local

# Run
pnpm dev
```

Visit `http://localhost:3000`

## Component Usage

```tsx
import { Weather } from "@/components/weather";
import { Calculator } from "@/components/calculator";
import { Orchestrator } from "@/components/orchestrator";

// Basic usage
<Weather />
<Calculator />
<Orchestrator />

// With props
<Weather placeholder="Enter a city..." className="h-full" />
```

## Key Dependencies

- `ai` - AI SDK core (ToolLoopAgent, tool, createAgentUIStreamResponse)
- `@ai-sdk/react` - React hooks (useChat)
- `@ai-sdk/gateway` - Vercel AI Gateway provider

## Exploration Areas

- [x] Agent as Component pattern
- [x] Subagent composition (orchestrator delegates to specialists)
- [x] Streaming tool results (real-time tool state in UI)
- [x] Agent state
  - [x] Session memory (agent remembers context during conversation)
  - [x] Agent modes (focus/active with UI indicator)
  - [x] Provider pattern with hooks for derived state
- [ ] Shared context (orchestrator passes context to subagents)

## Exploration Notes

### State via Tool Outputs

AI SDK's `experimental_context` and callbacks are **per-request** - they don't persist between HTTP requests.

**Solution:** State lives in tool outputs within message history. The client derives state by scanning messages for specific tool results.

```
// Memory
User: "My name is Ronny"
Agent: [calls rememberFact] → output stored in history
Agent: [sees fact in subsequent requests] → "Ronny, it's 18°C in Madrid"

// Modes
User: "Help me plan a trip"
Agent: [calls setMode("focus")] → UI shows amber "Gathering info" indicator
Agent: [asks clarifying questions]
Agent: [calls setMode("active")] → UI shows green "Ready" indicator
```

### Provider Pattern for Complex Agents

When an agent needs derived state (like current mode), the component evolves into a folder with Provider pattern:

```tsx
// Simple usage (pre-composed)
<Orchestrator />

// Composable (with hooks)
<OrchestratorProvider>
  <ModeIndicator />        {/* uses useAgentMode() */}
  <OrchestratorMessages /> {/* uses useOrchestrator() */}
  <OrchestratorInput />
</OrchestratorProvider>
```

Hooks (`useOrchestrator`, `useAgentMode`) enable standalone components that access agent state without prop drilling.

**Limitations:**
- State only lasts the session (lost on page refresh)
- Lives in message history, not external storage
