"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useOrchestrator } from "./context";
import { ChatInput } from "@/components/chat";

type OrchestratorInputProps = {
  placeholder?: string;
};

export function OrchestratorInput({
  placeholder = "Ask about weather or math...",
}: OrchestratorInputProps) {
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useOrchestrator();
  const inputRef = useRef<HTMLInputElement>(null);
  const wasLoadingRef = useRef(false);

  // Refocus when loading completes
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      inputRef.current?.focus();
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }, [input, sendMessage]);

  return (
    <ChatInput
      ref={inputRef}
      value={input}
      onChange={setInput}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      placeholder={placeholder}
      autoFocus
    />
  );
}
