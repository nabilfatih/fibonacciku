import * as React from "react"
import dynamic from "next/dynamic"
import { IconEye, IconRefresh, IconShare3 } from "@tabler/icons-react"

import type { Features, ShowChatMessage } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconStop } from "@/components/ui/icons"
import ButtonScrollToBottom from "@/components/chat/button-scroll-to-bottom"
import FooterText from "@/components/chat/footer"
import PromptForm from "@/components/chat/form"
import ChatShareDialog from "@/components/chat/share-dialog"
import SidebarDocument from "@/components/chat/sidebar-document"
import { shareChat } from "@/app/actions"

const ChatDocument = dynamic(() => import("@/components/chat/document"))

export type ChatPanelProps = {
  isLoading: boolean
  messages: ShowChatMessage[]
  type: Features
  prompt: string
  setPrompt: (value: string) => void
  id?: string
  title?: string
  createdAt?: string
  fileId?: string | null
}

export default function ChatPanel({
  id,
  messages,
  type,
  title,
  createdAt,
  isLoading,
  prompt,
  fileId,
  setPrompt
}: ChatPanelProps) {
  const t = useScopedI18n("FormChat")

  const { dispatch, stop, reload, handleSubmit } = useMessage()

  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-background/80 to-background duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <SidebarDocument>
        <ChatDocument />
      </SidebarDocument>
      <Button
        variant="outline"
        className={cn(
          "absolute -top-9 right-4 z-10 bg-background transition-opacity duration-300 sm:-top-10 sm:right-8",
          fileId && id ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => dispatch({ type: "SET_OPEN_DOCUMENT", payload: true })}
      >
        <IconEye className="mr-2 h-5 w-5" />
        {t(type as never)}
      </Button>
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="flex h-12 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2 h-5 w-5 animate-pulse" />
              {t("stop-generating")}
            </Button>
          ) : (
            messages?.length > 2 && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => reload(fileId || "")}>
                  <IconRefresh className="mr-2 h-5 w-5" />
                  {t("regenerate")}
                </Button>
                {id && title && createdAt && type ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare3 className="mr-2 h-5 w-5" />
                      {t("share")}
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        message: messages,
                        type,
                        created_at: createdAt
                      }}
                    />
                  </>
                ) : null}
              </div>
            )
          )}
        </div>
        <div className="space-y-2 border-t bg-background p-2 sm:border-none sm:bg-transparent">
          <PromptForm
            id={id}
            onSubmit={handleSubmit}
            input={prompt}
            setInput={setPrompt}
            isLoading={isLoading}
            type={type}
            fileId={fileId}
          />
          <FooterText
            className="hidden sm:block"
            text={
              type === "assistant"
                ? t("fibonacciku-make-mistake")
                : t("fibonacciku-answer-based-doc")
            }
          />
        </div>
      </div>
    </div>
  )
}
