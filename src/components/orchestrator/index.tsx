"use client";

// Re-export all pieces for composable usage
export {
  OrchestratorProvider,
  useOrchestrator,
  useAgentMode,
  useSessionContext,
} from "./context";
export { ModeIndicator } from "./mode-indicator";
export { SessionIndicator } from "./session-indicator";
export { OrchestratorMessages } from "./messages";
export { OrchestratorInput } from "./input";

// Composed component for simple usage
import { OrchestratorProvider } from "./context";
import { ModeIndicator } from "./mode-indicator";
import { SessionIndicator } from "./session-indicator";
import { OrchestratorMessages } from "./messages";
import { OrchestratorInput } from "./input";

type OrchestratorProps = {
  placeholder?: string;
  className?: string;
};

/**
 * Orchestrator Component
 *
 * A pre-composed chat interface to the orchestrator agent.
 * For custom layouts, use the individual components with OrchestratorProvider.
 *
 * @example Simple usage
 * <Orchestrator placeholder="Ask anything..." />
 *
 * @example Composable usage
 * <OrchestratorProvider>
 *   <Header><ModeIndicator /></Header>
 *   <OrchestratorMessages />
 *   <OrchestratorInput />
 * </OrchestratorProvider>
 */
export function Orchestrator({ placeholder, className }: OrchestratorProps) {
  return (
    <OrchestratorProvider>
      <div className={className}>
        <OrchestratorMessages />
        <div className="mt-4 flex items-center gap-2">
          <ModeIndicator />
          <SessionIndicator />
        </div>
        <div className="mt-2">
          <OrchestratorInput placeholder={placeholder} />
        </div>
      </div>
    </OrchestratorProvider>
  );
}
