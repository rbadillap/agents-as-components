"use client";

import { getToolName } from "ai";
import type { ToolUIPart, DynamicToolUIPart } from "ai";
import { XCircle } from "lucide-react";

type ToolInvocationProps = {
  part: ToolUIPart | DynamicToolUIPart;
};

function formatToolName(toolName: string): string {
  return toolName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function ToolError({
  toolName,
  error,
}: {
  toolName: string;
  error: string | undefined;
}) {
  return (
    <div
      className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-2 font-medium text-destructive">
        <XCircle className="size-4" aria-hidden="true" />
        {formatToolName(toolName)} failed
      </div>
      {error && (
        <pre className="mt-1 text-xs text-destructive/80">{error}</pre>
      )}
    </div>
  );
}

export function ToolInvocation({ part }: ToolInvocationProps) {
  const toolName = getToolName(part);

  // Only show errors - the header handles showing activity state
  if (part.state === "output-error") {
    return <ToolError toolName={toolName} error={part.errorText} />;
  }

  // Everything else hidden - clean chat with state in header
  return null;
}
