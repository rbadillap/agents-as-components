import { gateway } from "@ai-sdk/gateway";
import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";

/**
 * Calculator Agent
 *
 * Server-side agent definition with tools.
 * Used by the API route to process requests.
 */

export const calculateTool = tool({
  description: "Perform a mathematical calculation",
  inputSchema: z.object({
    expression: z.string().describe("Math expression to evaluate"),
  }),
  execute: async ({ expression }) => {
    const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");

    try {
      const result = new Function(`return ${sanitized}`)();

      if (typeof result !== "number" || !isFinite(result)) {
        return { error: "Invalid result", expression };
      }

      return { expression, result };
    } catch {
      return { error: "Failed to evaluate", expression };
    }
  },
});

const defaultInstructions = `You are a math assistant.
- Use the calculate tool for any math operations
- Show your work step by step
- Round decimals to 2 places when appropriate`;

export function createCalculatorAgent(customInstructions?: string) {
  return new ToolLoopAgent({
    id: "calculator",
    model: gateway("anthropic/claude-sonnet-4"),
    instructions: customInstructions ?? defaultInstructions,
    tools: {
      calculate: calculateTool,
    },
  });
}

// Default instance for simple usage
export const calculatorAgent = createCalculatorAgent();
