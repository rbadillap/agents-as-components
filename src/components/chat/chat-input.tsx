"use client";

import { forwardRef, useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from "lucide-react";

type ChatInputProps = {
  /** Current input value */
  value: string;
  /** Called when input value changes */
  onChange: (value: string) => void;
  /** Called when form is submitted */
  onSubmit: () => void;
  /** Whether the chat is loading/processing */
  isLoading?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Auto-focus input on mount */
  autoFocus?: boolean;
};

/**
 * Minimalist chat input component.
 */
export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  function ChatInput(
    {
      value,
      onChange,
      onSubmit,
      isLoading = false,
      placeholder = "Send a message...",
      className,
      disabled = false,
      autoFocus = false,
    },
    ref
  ) {
    const inputId = useId();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim() || isLoading || disabled) return;
      onSubmit();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={cn("flex items-center gap-2", className)}
      >
        <label
          htmlFor={inputId}
          className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
          style={{ clip: "rect(0, 0, 0, 0)" }}
        >
          Message input
        </label>
        <Input
          ref={ref}
          id={inputId}
          name="message"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          aria-describedby={isLoading ? `${inputId}-status` : undefined}
          className="flex-1 bg-transparent border-border font-mono text-sm"
        />
        <Button
          type="submit"
          disabled={isLoading || disabled || !value.trim()}
          aria-label={isLoading ? "Sending message" : "Send message"}
          size="icon"
          variant="outline"
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowUp className="size-4" aria-hidden="true" />
          )}
        </Button>
        {isLoading && (
          <span
            id={`${inputId}-status`}
            className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
            style={{ clip: "rect(0, 0, 0, 0)" }}
            aria-live="polite"
          >
            Processing your message
          </span>
        )}
      </form>
    );
  }
);
