"use client";

// Re-export all pieces for composable usage
export {
  OrchestratorProvider,
  useOrchestrator,
  useAgentMode,
  useActiveAgent,
  useSessionContext,
} from "./context";
export { ModeIndicator } from "./mode-indicator";
export { SessionIndicator } from "./session-indicator";
export { OrchestratorHeader } from "./header";
export { OrchestratorMessages } from "./messages";
export { OrchestratorInput } from "./input";

// Composed component for simple usage
import { OrchestratorProvider } from "./context";
import { OrchestratorHeader } from "./header";
import { OrchestratorMessages } from "./messages";
import { OrchestratorInput } from "./input";

type OrchestratorProps = {
  placeholder?: string;
  className?: string;
};

/**
 * Orchestrator Component - Minimalist chat interface
 */
export function Orchestrator({ placeholder, className }: OrchestratorProps) {
  return (
    <OrchestratorProvider>
      <div className={className}>
        <OrchestratorHeader />
        <OrchestratorMessages />
        <div className="p-4 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <OrchestratorInput placeholder={placeholder} />
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
