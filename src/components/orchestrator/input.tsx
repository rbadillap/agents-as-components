"use client";

import { useState, useCallback } from "react";
import { useOrchestrator } from "./context";

type OrchestratorInputProps = {
  placeholder?: string;
};

export function OrchestratorInput({
  placeholder = "Ask about weather or math...",
}: OrchestratorInputProps) {
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useOrchestrator();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, sendMessage]
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
