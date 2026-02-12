import { Weather } from "@/components/weather";
import { Calculator } from "@/components/calculator";
import { Orchestrator } from "@/components/orchestrator";

/**
 * Home Page - AI SDK Agents Explorer
 *
 * Demonstrates the "Agent as Component" pattern:
 * - Agents live in src/agents/ (server-side ToolLoopAgent)
 * - Components live in src/components/ (client-side useChat)
 * - Components accept props like placeholder, className
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">AI SDK Agents</h1>
          <p className="text-neutral-500">
            Exploring the Agent as Component pattern
          </p>
        </header>

        {/* Orchestrator - Full Width */}
        <section className="mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Orchestrator
            <span className="text-xs text-neutral-500 font-normal">
              (delegates to Weather + Calculator)
            </span>
          </h2>
          <div className="border rounded-lg p-4 dark:border-neutral-800 border-purple-200 dark:border-purple-900 h-96 flex flex-col">
            <Orchestrator className="flex flex-col h-full" />
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Weather Component */}
          <section>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌤️</span> Weather
            </h2>
            <div className="border rounded-lg p-4 dark:border-neutral-800 h-96 flex flex-col">
              <Weather className="flex flex-col h-full" />
            </div>
          </section>

          {/* Calculator Component */}
          <section>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🧮</span> Calculator
            </h2>
            <div className="border rounded-lg p-4 dark:border-neutral-800 h-96 flex flex-col">
              <Calculator className="flex flex-col h-full" />
            </div>
          </section>
        </div>

        {/* Project Structure */}
        <section className="mt-12">
          <h2 className="font-semibold mb-4">Project Structure</h2>
          <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg overflow-x-auto text-sm">
            {`src/
├── agents/
│   ├── weather.ts       # ToolLoopAgent + tools
│   ├── calculator.ts
│   └── orchestrator.ts  # Subagent composition
├── components/
│   ├── weather.tsx      # "use client" + useChat
│   ├── calculator.tsx
│   └── orchestrator.tsx
└── app/api/agents/
    ├── weather/route.ts
    ├── calculator/route.ts
    └── orchestrator/route.ts`}
          </pre>
        </section>

        {/* Component Props */}
        <section className="mt-8">
          <h2 className="font-semibold mb-4">Component Props</h2>
          <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg overflow-x-auto text-sm">
            {`<Weather
  placeholder="Custom input placeholder..."
  className="custom-styles"
/>

<Calculator placeholder="Enter a problem..." />

<Orchestrator className="flex flex-col h-full" />`}
          </pre>
        </section>
      </div>
    </main>
  );
}
