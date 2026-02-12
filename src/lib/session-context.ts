import type { UIMessage, ModelMessage } from "ai";
import { isToolUIPart, getToolName } from "ai";

export type SessionContext = {
  name: string | null;
  location: string | null;
  preferences: string[];
  other: string[];
};

type RememberFactOutput = {
  stored: boolean;
  category: "name" | "preference" | "location" | "other";
  fact: string;
};

function applyFact(context: SessionContext, output: RememberFactOutput): void {
  switch (output.category) {
    case "name":
      context.name = output.fact;
      break;
    case "location":
      context.location = output.fact;
      break;
    case "preference":
      if (!context.preferences.includes(output.fact)) {
        context.preferences.push(output.fact);
      }
      break;
    case "other":
      if (!context.other.includes(output.fact)) {
        context.other.push(output.fact);
      }
      break;
  }
}

function createEmptyContext(): SessionContext {
  return {
    name: null,
    location: null,
    preferences: [],
    other: [],
  };
}

/**
 * Extract session context from UI message history (client-side).
 *
 * Scans all messages for rememberFact tool outputs and builds
 * a deterministic context object.
 */
export function extractSessionContext(messages: UIMessage[]): SessionContext {
  const context = createEmptyContext();

  for (const message of messages) {
    if (message.role !== "assistant") continue;

    for (const part of message.parts) {
      if (
        isToolUIPart(part) &&
        getToolName(part) === "rememberFact" &&
        part.state === "output-available"
      ) {
        applyFact(context, part.output as RememberFactOutput);
      }
    }
  }

  return context;
}

/**
 * Extract session context from model message history (server-side).
 *
 * Scans all messages for rememberFact tool results and builds
 * a deterministic context object.
 */
export function extractSessionContextFromModel(
  messages: ModelMessage[]
): SessionContext {
  const context = createEmptyContext();

  for (const message of messages) {
    if (message.role !== "tool") continue;

    for (const part of message.content) {
      if (part.type === "tool-result" && part.toolName === "rememberFact") {
        const output = part.output as unknown as RememberFactOutput | undefined;
        if (output?.stored) {
          applyFact(context, output);
        }
      }
    }
  }

  return context;
}

/**
 * Format session context as a prefix for subagent prompts.
 *
 * Returns an empty string if no context is available.
 *
 * @example
 * formatContextPrefix({ name: "Ronny", location: "Madrid", preferences: [], other: [] })
 * // "[User: Ronny | Location: Madrid] "
 */
export function formatContextPrefix(context: SessionContext): string {
  const parts: string[] = [];

  if (context.name) parts.push(`User: ${context.name}`);
  if (context.location) parts.push(`Location: ${context.location}`);
  if (context.preferences.length) {
    parts.push(`Preferences: ${context.preferences.join(", ")}`);
  }

  return parts.length ? `[${parts.join(" | ")}] ` : "";
}

/**
 * Check if session context has any meaningful data.
 */
export function hasSessionContext(context: SessionContext): boolean {
  return !!(
    context.name ||
    context.location ||
    context.preferences.length ||
    context.other.length
  );
}
