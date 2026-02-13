"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ChatEmptyProps = {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom icon to display */
  icon?: ReactNode;
  /** Additional class names */
  className?: string;
};

function PixelLogo() {
  return (
    <span
      className="text-4xl text-muted-foreground/70"
      style={{ fontFamily: "var(--font-pixel)" }}
      aria-hidden="true"
    >
      &lt;Agent /&gt;
    </span>
  );
}

/**
 * Empty state component for chat interfaces.
 * Minimalist design inspired by Pixo.
 */
export function ChatEmpty({
  title = "Start a conversation",
  description = "Send a message to begin",
  icon,
  className,
}: ChatEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-8",
        className
      )}
    >
      {icon ?? <PixelLogo />}
      <div className="space-y-2 text-center">
        <h2 className="font-mono text-lg text-foreground">{title}</h2>
        <p className="font-mono text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
