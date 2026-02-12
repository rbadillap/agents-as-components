"use client";

import { getToolName } from "ai";
import type { ToolUIPart, DynamicToolUIPart } from "ai";

type ToolInvocationProps = {
  part: ToolUIPart | DynamicToolUIPart;
};

function formatToolName(toolName: string): string {
  return toolName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function Spinner({ toolName }: { toolName: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>{formatToolName(toolName)} preparing...</span>
    </div>
  );
}

function ToolExecuting({ toolName }: { toolName: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Running {formatToolName(toolName)}...</span>
    </div>
  );
}

function ToolOutput({
  toolName,
  output,
}: {
  toolName: string;
  output: unknown;
}) {
  const outputStr =
    typeof output === "string" ? output : JSON.stringify(output, null, 2);

  return (
    <details className="text-sm border border-neutral-200 dark:border-neutral-700 rounded p-2 my-1">
      <summary className="cursor-pointer text-green-600 dark:text-green-400 font-medium">
        {formatToolName(toolName)} completed
      </summary>
      <pre className="mt-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded text-xs overflow-x-auto whitespace-pre-wrap">
        {outputStr}
      </pre>
    </details>
  );
}

function ToolError({
  toolName,
  error,
}: {
  toolName: string;
  error: string | undefined;
}) {
  return (
    <div className="text-sm border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 rounded p-2 my-1">
      <div className="text-red-600 dark:text-red-400 font-medium">
        {formatToolName(toolName)} failed
      </div>
      {error && (
        <pre className="mt-1 text-xs text-red-500 dark:text-red-400">
          {error}
        </pre>
      )}
    </div>
  );
}

function RememberedFact({ output }: { output: { category: string; fact: string } }) {
  return (
    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 italic my-1">
      <span className="text-blue-500">💭</span>
      <span>Remembered ({output.category}): {output.fact}</span>
    </div>
  );
}

export function ToolInvocation({ part }: ToolInvocationProps) {
  const toolName = getToolName(part);
  const state = part.state;

  // Special rendering for rememberFact tool
  if (toolName === "rememberFact" && state === "output-available") {
    const output = part.output as { category: string; fact: string };
    return <RememberedFact output={output} />;
  }

  switch (state) {
    case "input-streaming":
      return <Spinner toolName={toolName} />;
    case "input-available":
      return <ToolExecuting toolName={toolName} />;
    case "output-available":
      return <ToolOutput toolName={toolName} output={part.output} />;
    case "output-error":
      return <ToolError toolName={toolName} error={part.errorText} />;
    default:
      return null;
  }
}
