import { cn } from "@/lib/utils";
import type { IndexMessage, ShowChatMessage } from "@/types/types";
import ChatAvatar from "@/components/chat/avatar";
import ChatAssistant from "@/components/chat/assistant";
import ChatUser from "./user";

type Props = {
  index: number;
  message: ShowChatMessage;
  currentIndex: IndexMessage;
  type: "assistant" | "document";
};

export default function ChatMessage({
  index,
  message,
  currentIndex,
  type,
  ...props
}: Props) {
  const isAssistant = message.role === "assistant";
  const contentIndex = currentIndex.currentMessage - 1;
  const messageIndex = currentIndex.index;
  const contentLength = message.content.length;

  return (
    <div
      className={cn("group relative mb-4 flex items-start md:-ml-12")}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 select-none items-center justify-center rounded-full shadow"
        )}
      >
        <ChatAvatar role={message.role} />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {isAssistant ? (
          <ChatAssistant
            index={index}
            content={message.content}
            currentIndex={currentIndex}
            type={type}
          />
        ) : (
          <ChatUser content={message.content[contentIndex]} />
        )}
      </div>
    </div>
  );
}
