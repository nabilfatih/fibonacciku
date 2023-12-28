"use client";

import { cn } from "@/lib/utils";
import ChatScrollAnchor from "@/components/chat/scroll-anchor";
import type { ChatMessage } from "@/types/types";

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
  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}></div>
      {/* <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      /> */}
    </>
  );
}
