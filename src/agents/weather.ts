import { gateway } from "@ai-sdk/gateway";
import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";

/**
 * Weather Agent
 *
 * Server-side agent definition with tools.
 * Used by the API route to process requests.
 */

export const weatherTool = tool({
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name"),
  }),
  execute: async ({ location }) => {
    const temp = 72 + Math.floor(Math.random() * 21) - 10;
    const conditions = ["sunny", "cloudy", "rainy"][
      Math.floor(Math.random() * 3)
    ];
    return { location, temperature: temp, conditions, unit: "fahrenheit" };
  },
});

export const convertToCelsiusTool = tool({
  description: "Convert Fahrenheit to Celsius",
  inputSchema: z.object({
    fahrenheit: z.number(),
  }),
  execute: async ({ fahrenheit }) => ({
    fahrenheit,
    celsius: Math.round((fahrenheit - 32) * (5 / 9)),
  }),
});

export const weatherAgent = new ToolLoopAgent({
  id: "weather",
  model: gateway("anthropic/claude-sonnet-4"),
  instructions: `You are a weather assistant.
- Get weather for any location
- Always convert to Celsius when reporting
- Be concise and friendly`,
  tools: {
    weather: weatherTool,
    convertToCelsius: convertToCelsiusTool,
  },
});
