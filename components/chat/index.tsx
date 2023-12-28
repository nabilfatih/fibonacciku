"use client";

import { cn } from "@/lib/utils";
import ChatScrollAnchor from "@/components/chat/scroll-anchor";
import type { ChatMessage, ShowChatMessage } from "@/types/types";
import dynamic from "next/dynamic";

const ChatPanel = dynamic(() => import("@/components/chat/panel"));

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: ChatMessage[];
  id?: string;
  type?: "assistant" | "document";
  title?: string;
  createdAt?: string;
}

export default function ChatMessage({
  id,
  initialMessages,
  className,
  type,
  title,
  createdAt,
}: ChatProps) {
  if (id && type === "document") {
    // handle chat with document
    return null; // TODO: implement chat with document
  }

  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}></div>

      {type === "document" ? (
        <div></div>
      ) : (
        <ChatPanel
          id={id}
          isLoading={false}
          messages={initialMessages as ShowChatMessage[]}
          type={type as "assistant" | "document"}
          title={title}
          createdAt={createdAt}
        />
      )}
    </>
  );
}
