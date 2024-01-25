import type { IndexMessage, ShowChatMessage } from "@/types/types"
import { cn } from "@/lib/utils"
import { useCurrentLocale } from "@/locales/client"

import ChatAssistant from "@/components/chat/assistant"
import ChatAvatar from "@/components/chat/avatar"
import ChatMessageActions from "@/components/chat/message-action"
import ChatMetadata from "@/components/chat/metadata"
import ChatUser from "@/components/chat/user"

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

  const createdAt = new Date(message.created_at || new Date())
  let formattedDate = ""

  const today = new Date()

  if (createdAt.toDateString() === today.toDateString()) {
    formattedDate = createdAt.toTimeString().substring(0, 5)
  } else {
    formattedDate = createdAt.toLocaleDateString(locale, {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric"
    })
  }
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
          createdAt={formattedDate}
          currentIndex={currentIndex}
          contentLength={contentLength}
          messageIndex={messageIndex}
        />
      </div>
    </div>
  )
}
