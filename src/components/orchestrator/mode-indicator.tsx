"use client";

import { useAgentMode } from "./context";

export function ModeIndicator() {
  const agentMode = useAgentMode();

  if (agentMode.isDefault) return null;

  const isFocus = agentMode.mode === "focus";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300
      ${
        isFocus
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isFocus ? "bg-amber-500 animate-pulse" : "bg-green-500"
        }`}
      />
      <span>{isFocus ? "Gathering info" : "Ready"}</span>
    </div>
  );
}
