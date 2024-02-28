import * as React from "react"
import dynamic from "next/dynamic"
import { IconEye } from "@tabler/icons-react"

import type { Features } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import ButtonScrollToBottom from "@/components/chat/button-scroll-to-bottom"
import SidebarDocument from "@/components/chat/document-sidebar"
import FooterText from "@/components/chat/footer"
import PromptForm from "@/components/chat/form"

const ChatDocument = dynamic(() => import("@/components/chat/document"))

export type ChatPanelProps = {
  isLoading: boolean
  type: Features
  prompt: string
  setPrompt: (value: string) => void
  id?: string
  fileId?: string | null
}

export default function ChatPanel({
  id,
  type,
  isLoading,
  prompt,
  fileId,
  setPrompt
}: ChatPanelProps) {
  const t = useScopedI18n("FormChat")

  const { dispatch, handleSubmit, state } = useMessage()

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-background/80 to-background duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <SidebarDocument>
        <ChatDocument />
      </SidebarDocument>
      <Button
        variant="outline"
        className={cn(
          "absolute -top-9 right-4 z-10 bg-background transition-opacity duration-300 sm:-top-10 sm:right-8",
          (fileId && id) || state.currentDocument
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => dispatch({ type: "SET_OPEN_DOCUMENT", payload: true })}
      >
        <IconEye className="mr-2 h-5 w-5" />
        {t(type as never)}
      </Button>
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="flex h-12 items-center justify-center"></div>
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
