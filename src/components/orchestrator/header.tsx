"use client";

import {
  useAgentMode,
  useActiveAgent,
  useSessionContext,
  useOrchestrator,
} from "./context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, MapPin, Loader2 } from "lucide-react";

export function OrchestratorHeader() {
  const { mode } = useAgentMode();
  const { displayName: activeAgentName } = useActiveAgent();
  const context = useSessionContext();
  const { isLoading } = useOrchestrator();

  const isFocus = mode === "focus";
  const isWorking = isLoading || activeAgentName;

  // Determine status text
  const statusText = activeAgentName
    ? activeAgentName
    : isFocus
      ? "Thinking"
      : "Ready";

  // Determine indicator color
  const indicatorColor = activeAgentName
    ? "bg-sky-500"      // Delegating to sub-agent
    : isWorking
      ? "bg-amber-500"  // Thinking
      : "bg-green-500"; // Ready

  // Pulse when working
  const shouldPulse = isWorking || activeAgentName;

  return (
    <header className="flex items-center gap-3 px-4 py-2 border-b border-border text-sm font-mono">
      {/* Mode indicator */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "size-2 rounded-full",
            indicatorColor,
            shouldPulse && "animate-pulse"
          )}
        />
        <span className="text-muted-foreground">{statusText}</span>
      </div>

      {/* Session context */}
      {context.name && (
        <Badge variant="secondary" className="gap-1 font-mono text-xs">
          <User className="size-3" />
          {context.name}
        </Badge>
      )}
      {context.location && (
        <Badge variant="secondary" className="gap-1 font-mono text-xs">
          <MapPin className="size-3" />
          {context.location}
        </Badge>
      )}

      {/* Activity indicator */}
      {isLoading && (
        <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" aria-hidden="true" />
      )}
    </header>
  );
}
