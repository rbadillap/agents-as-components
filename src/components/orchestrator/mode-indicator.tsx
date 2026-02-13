"use client";

import { useAgentMode } from "./context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Displays the current agent mode (active/focus).
 * Uses aria-live to announce mode changes to screen readers.
 */
export function ModeIndicator() {
  const agentMode = useAgentMode();

  if (agentMode.isDefault) return null;

  const isFocus = agentMode.mode === "focus";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 transition-all duration-300",
        isFocus
          ? "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          : "border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400"
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isFocus ? "bg-amber-500 animate-pulse" : "bg-green-500"
        )}
        aria-hidden="true"
      />
      <span>{isFocus ? "Gathering info" : "Ready"}</span>
    </Badge>
  );
}
