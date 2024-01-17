import { IconCheck, IconCopy, IconEdit, IconX } from "@tabler/icons-react"

import type { IndexMessage } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ChatMessageActionPagination from "@/components/chat/message-action-pagination"
import ChatMessageActionSpeech from "@/components/chat/message-action-speech"

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  content: string
  createdAt: string
  currentIndex: IndexMessage
  contentLength: number
  isAssistant: boolean
  messageIndex: number
}

export default function ChatMessageActions({
  content,
  createdAt,
  className,
  currentIndex,
  contentLength,
  isAssistant,
  messageIndex,
  ...props
}: ChatMessageActionsProps) {
  const { state, handleEditMessage, handleSubmit } = useMessage()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(content)
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2",
        className
      )}
      {...props}
    >
      <span className="text-xs text-muted-foreground">{createdAt}</span>
      <div className="flex items-center">
        {isAssistant && contentLength > 1 && (
          <ChatMessageActionPagination
            currentIndex={currentIndex}
            contentLength={contentLength}
          />
        )}

        {!isAssistant && (
          <>
            {messageIndex === state.editMessageIndex ? (
              <form
                onSubmit={e => {
                  handleSubmit(e, true, state.currentChat?.file_id || "")
                  handleEditMessage(false) // Reset edit message state
                }}
                className="flex items-center"
              >
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  disabled={state.isLoading}
                >
                  <IconCheck className="h-4 w-4" />
                  <span className="sr-only">Submit Edit Message</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={state.isLoading}
                  onClick={() => handleEditMessage(false)}
                >
                  <IconX className="h-4 w-4" />
                  <span className="sr-only">Cancel Edit message</span>
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                disabled={state.isLoading}
                onClick={() => handleEditMessage(true, content, messageIndex)}
              >
                <IconEdit className="h-4 w-4" />
                <span className="sr-only">Edit message</span>
              </Button>
            )}
          </>
        )}

        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? (
            <IconCheck className="h-4 w-4" />
          ) : (
            <IconCopy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy message</span>
        </Button>
        <ChatMessageActionSpeech text={content} />
      </div>
    </div>
  )
}
