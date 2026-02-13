import { Orchestrator } from "@/components/orchestrator";

export default function Home() {
  return (
    <main className="h-screen bg-background text-foreground flex flex-col">
      <Orchestrator className="flex flex-col flex-1" />
    </main>
  );
}
