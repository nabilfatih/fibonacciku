import { cn } from "@/lib/utils"
import type { IndexMessage, ShowChatMessage } from "@/types/types"
import ChatAvatar from "@/components/chat/avatar"
import ChatAssistant from "@/components/chat/assistant"
import ChatUser from "@/components/chat/user"
import ChatMessageActions from "@/components/chat/message-action"
import moment from "moment"
import { useCurrentLocale } from "@/locales/client"
import ChatMetadata from "@/components/chat/metadata"

type Props = {
  index: number
  message: ShowChatMessage
  currentIndex: IndexMessage
}

export default function ChatMessage({
  index,
  message,
  currentIndex,
  ...props
}: Props) {
  const locale = useCurrentLocale()

  const isAssistant = message.role === "assistant"
  const contentIndex = currentIndex.currentMessage - 1
  const messageIndex = currentIndex.index
  const contentLength = message.content.length

  const createdAt = moment(message.created_at).locale(locale).calendar(null, {
    sameDay: "HH:mm",
    lastDay: "DD/MM/YYYY HH:mm",
    lastWeek: "DD/MM/YYYY HH:mm",
    sameElse: "DD/MM/YYYY HH:mm"
  })

  if (message.role === "system") return null

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
      <div className="ml-4 flex-1 space-y-2 overflow-hidden sm:px-1">
        {message.metadata && (
          <ChatMetadata
            metadata={message.metadata}
            contentIndex={contentIndex}
          />
        )}
        {isAssistant ? (
          <ChatAssistant
            index={index}
            content={message.content}
            currentIndex={currentIndex}
          />
        ) : (
          <ChatUser
            content={message.content[contentIndex]}
            messageIndex={messageIndex}
          />
        )}
        <ChatMessageActions
          isAssistant={isAssistant}
          content={message.content[contentIndex]}
          createdAt={createdAt}
          currentIndex={currentIndex}
          contentLength={contentLength}
          messageIndex={messageIndex}
        />
      </div>
    </div>
  )
}
