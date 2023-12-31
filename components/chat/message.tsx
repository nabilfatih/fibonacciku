import { cn } from "@/lib/utils";
import type { IndexMessage, ShowChatMessage } from "@/types/types";
import ChatAvatar from "@/components/chat/avatar";
import ChatAssistant from "@/components/chat/assistant";
import ChatUser from "./user";
import { ChatMessageActions } from "./message-action";
import moment from "moment";
import { useCurrentLocale } from "@/locales/client";

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
  const locale = useCurrentLocale();

  const isAssistant = message.role === "assistant";
  const contentIndex = currentIndex.currentMessage - 1;
  const messageIndex = currentIndex.index;
  const contentLength = message.content.length;

  const createdAt = moment(message.created_at).locale(locale).calendar(null, {
    sameDay: "HH:mm",
    lastDay: "DD/MM/YYYY HH:mm",
    lastWeek: "DD/MM/YYYY HH:mm",
    sameElse: "DD/MM/YYYY HH:mm",
  });

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
      <div className="ml-4 flex-1 space-y-2 overflow-hidden">
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
        <ChatMessageActions
          isAssistant={isAssistant}
          content={message.content[contentIndex]}
          createdAt={createdAt}
          currentIndex={currentIndex}
          contentLength={contentLength}
        />
      </div>
    </div>
  );
}
