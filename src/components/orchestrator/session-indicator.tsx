"use client";

import { useSessionContext } from "./context";
import { hasSessionContext } from "@/lib/session-context";

/**
 * SessionIndicator Component
 *
 * Displays the current session context (name, location, preferences).
 * Only renders when there is meaningful context to show.
 */
export function SessionIndicator() {
  const context = useSessionContext();

  if (!hasSessionContext(context)) return null;

  return (
    <div className="text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-2">
      {context.name && <span>User: {context.name}</span>}
      {context.location && <span>Location: {context.location}</span>}
      {context.preferences.length > 0 && (
        <span>Preferences: {context.preferences.join(", ")}</span>
      )}
    </div>
  );
}
