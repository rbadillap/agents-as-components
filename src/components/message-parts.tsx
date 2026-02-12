"use client";

import { isToolUIPart } from "ai";
import type { UIMessage } from "ai";
import { ToolInvocation } from "./tool-invocation";

type MessagePartsProps = {
  message: UIMessage;
};

export function MessageParts({ message }: MessagePartsProps) {
  return (
    <>
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return part.text ? <p key={i}>{part.text}</p> : null;
        }

        if (isToolUIPart(part)) {
          return <ToolInvocation key={i} part={part} />;
        }

        return null;
      })}
    </>
  );
}
