# AI SDK Agents Explorer

Exploring composable AI agents with Vercel AI SDK.

## The Pattern

**Idea**: An AI agent can be treated like a React component - encapsulated, reusable, and composable.

```
src/
├── agents/           # Server: agent definitions (ToolLoopAgent)
│   ├── weather.ts
│   └── calculator.ts
├── components/       # Client: React components (useChat)
│   ├── weather.tsx
│   └── calculator.tsx
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

// Basic
<Weather />
<Calculator />

// With custom instructions
<Weather instructions="Include humidity in responses" />
<Calculator instructions="Explain each step" />
```

## Key Dependencies

- `ai` - AI SDK core (ToolLoopAgent, tool, createAgentUIStreamResponse)
- `@ai-sdk/react` - React hooks (useChat)
- `@ai-sdk/gateway` - Vercel AI Gateway provider

## Security Lab

Visit `/security` to test prompt injection attacks.

The `Assistant` component accepts `instructions` prop from clients, making it vulnerable to:
- Instruction override attacks
- Tool manipulation
- System prompt leaks
- Role hijacking

**Mitigations explored:**
1. Never expose instructions to clients
2. Use allowlist of predefined variants
3. Sandbox user instructions with boundaries
4. Filter outputs for leaked secrets

## Exploration Areas

- [x] Agent as Component pattern
- [x] Props for customization (instructions, placeholder)
- [x] Security: prompt injection via instructions prop
- [x] Subagent composition
- [ ] Streaming tool results
- [ ] Agent state persistence
