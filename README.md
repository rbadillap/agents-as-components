# AI SDK Agents Explorer

Exploring composable AI agents with Vercel AI SDK.

## The Pattern

**Idea**: An AI agent can be treated like a React component - encapsulated, reusable, and composable.

```
src/
├── agents/           # Server: agent definitions (ToolLoopAgent)
│   ├── weather.ts
│   ├── calculator.ts
│   └── orchestrator.ts
├── components/       # Client: React components (useChat)
│   ├── weather.tsx
│   ├── calculator.tsx
│   └── orchestrator.tsx
└── app/api/agents/   # API routes
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
- [ ] Agent state
  - [ ] Session memory (agent remembers context during conversation)
  - [ ] Agent modes (state machine: onboarding → active → done)
  - [ ] Shared context (orchestrator passes context to subagents)
