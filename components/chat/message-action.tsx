import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconRefresh,
  IconX
} from "@tabler/icons-react"

import type { IndexMessage } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import ChatMessageActionPagination from "@/components/chat/message-action-pagination"
import ChatMessageActionSpeech from "@/components/chat/message-action-speech"

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  content: string
  createdAt: string
  currentIndex: IndexMessage
  contentLength: number
  isAssistant: boolean
  messageIndex: number
  isLastMessage: boolean
}

export default function ChatMessageActions({
  content,
  createdAt,
  className,
  currentIndex,
  contentLength,
  isAssistant,
  messageIndex,
  isLastMessage,
  ...props
}: ChatMessageActionsProps) {
  const t = useScopedI18n("FormChat")
  const { state, handleEditMessage, handleSubmit, reload } = useMessage()
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={state.isLoading}
                    >
                      <IconCheck className="h-4 w-4" />
                      <span className="sr-only">Submit Edit Message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("submit")}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("cancel")}</p>
                  </TooltipContent>
                </Tooltip>
              </form>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={state.isLoading}
                    onClick={() =>
                      handleEditMessage(true, content, messageIndex)
                    }
                  >
                    <IconEdit className="h-4 w-4" />
                    <span className="sr-only">Edit message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("edit")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </>
        )}

        {isLastMessage && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={state.isLoading}
                onClick={() => reload(state.currentChat?.file_id || "")}
              >
                <IconRefresh className="h-4 w-4" />
                <span className="sr-only">Regenerate</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("regenerate")}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onCopy}>
              {isCopied ? (
                <IconCheck className="h-4 w-4" />
              ) : (
                <IconCopy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy message</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isCopied ? t("copied") : t("copy-to-clipboard")}</p>
          </TooltipContent>
        </Tooltip>

        <ChatMessageActionSpeech text={content} />
      </div>
    </div>
  )
}
