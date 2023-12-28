"use client";

import { cn } from "@/lib/utils";
import ChatScrollAnchor from "@/components/chat/scroll-anchor";
import type { ChatMessage, ShowChatMessage } from "@/types/types";
import { ChatPanel } from "./panel";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: ChatMessage[];
  id?: string;
  type?: "assistant" | "document";
}

export default function ChatMessage({
  id,
  initialMessages,
  className,
  type,
}: ChatProps) {
  if (id && type === "document") {
    // handle chat with document
    return null; // TODO: implement chat with document
  }

  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}></div>
      <ChatPanel
        id={id}
        isLoading={false}
        messages={initialMessages as ShowChatMessage[]}
      />
    </>
  );
}
