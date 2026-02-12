import { gateway } from "@ai-sdk/gateway";
import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";
import { weatherAgent } from "./weather";
import { calculatorAgent } from "./calculator";

/**
 * Orchestrator Agent
 *
 * A meta-agent that delegates tasks to specialized subagents.
 * Demonstrates the subagent composition pattern.
 */

export const delegateWeatherTool = tool({
  description: "Delegate weather queries to the weather specialist",
  inputSchema: z.object({
    task: z.string().describe("The weather question to ask the specialist"),
  }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await weatherAgent.generate({ prompt: task, abortSignal });
    return result.text;
  },
});

export const delegateCalculatorTool = tool({
  description: "Delegate math queries to the calculator specialist",
  inputSchema: z.object({
    task: z.string().describe("The math problem to solve"),
  }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await calculatorAgent.generate({ prompt: task, abortSignal });
    return result.text;
  },
});

export const rememberFactTool = tool({
  description:
    "Remember an important fact the user shared (name, preferences, location). Use this when the user tells you personal information you should remember for the conversation.",
  inputSchema: z.object({
    category: z
      .enum(["name", "preference", "location", "other"])
      .describe("Category of the fact"),
    fact: z.string().describe("The fact to remember"),
  }),
  execute: async ({ category, fact }) => {
    return { stored: true, category, fact };
  },
});

export const setModeTool = tool({
  description: `Switch your operational mode to signal your current state.
Use 'focus' when: asking clarifying questions, gathering information you need, multi-step research.
Use 'active' when: providing final answers, completing tasks, normal conversation flow.`,
  inputSchema: z.object({
    mode: z.enum(["active", "focus"]).default("active"),
    reason: z.string().describe("Brief reason for the mode change"),
  }),
  execute: async ({ mode, reason }) => {
    return { mode, reason, timestamp: Date.now() };
  },
});

export const orchestratorAgent = new ToolLoopAgent({
  id: "orchestrator",
  model: gateway("anthropic/claude-sonnet-4"),
  instructions: `You are an orchestrator that routes tasks to specialists and maintains session memory.

Routing:
- Weather questions → use delegateWeather tool
- Math questions → use delegateCalculator tool
- When a question needs both, call both tools and combine the results

Memory:
- When the user shares personal info (name, preferences, locations), use rememberFact to store it
- Reference remembered facts naturally in your responses
- Include relevant context when delegating to specialists (e.g., "User Ronny wants weather for Madrid")

Mode Signaling:
- Use setMode('focus') when you need to gather more information before answering (asking clarifying questions, multi-step research)
- Use setMode('active') when providing final answers or completing tasks
- This helps the UI show the user your current state

Always provide a unified, coherent response to the user.`,
  tools: {
    delegateWeather: delegateWeatherTool,
    delegateCalculator: delegateCalculatorTool,
    rememberFact: rememberFactTool,
    setMode: setModeTool,
  },
});
