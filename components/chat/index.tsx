"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import useSWRImmutable from "swr/immutable"

import type { Chat, ChatMessage, Features } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { cn } from "@/lib/utils"

import ChatScrollAnchor from "@/components/chat/scroll-anchor"
import { getChatFile } from "@/app/actions/chat"

const ChatPanel = dynamic(() => import("@/components/chat/panel"))
const ChatList = dynamic(() => import("@/components/chat/list"))
const EmptyScreen = dynamic(() => import("@/components/chat/empty-screen"))

export interface ChatProps extends React.ComponentProps<"div"> {
  type: Features
  chat?: Chat
  initialMessages?: ChatMessage[]
  id?: string
  title?: string
  fileId?: string | null
  createdAt?: string
}

export default function ChatMessage({
  id,
  chat,
  initialMessages,
  className,
  type,
  title,
  fileId,
  createdAt
}: ChatProps) {
  const {
    showMessage,
    indexMessage,
    state,
    dispatch,
    setShowMessage,
    setIndexMessage,
    stop
  } = useMessage()

  const chatMessageRef = useRef<HTMLDivElement | null>(null)

  const { data: file } = useSWRImmutable(
    fileId ? [fileId, type] : null,
    ([fileId, type]) => getChatFile(fileId, type),
    {
      refreshInterval: 1000 * 60 * 60 * 24 // 1 day
    }
  )

  useEffect(() => {
    if (file?.data) {
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: file.data })
      dispatch({ type: "SET_INITIAL_PAGE", payload: 1 }) // reset page
    } else {
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (initialMessages) {
      stop()
      setIndexMessage([])
      setShowMessage(initialMessages)
      dispatch({ type: "SET_CURRENT_CHAT", payload: chat || null })
    } else {
      stop()
      setShowMessage([])
      setIndexMessage([])
      dispatch({ type: "SET_CURRENT_CHAT", payload: null })
    }
    return () => {
      stop()
      setShowMessage([])
      setIndexMessage([])
      dispatch({ type: "SET_CURRENT_CHAT", payload: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages])

  return (
    <>
      <main
        ref={chatMessageRef}
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10",
          className
        )}
      >
        {!id && showMessage.length === 0 && <EmptyScreen type={type} />}

        {showMessage.length > 0 && indexMessage.length > 0 ? (
          <>
            <ChatList
              chatMessageRef={chatMessageRef}
              messages={showMessage}
              indexMessage={indexMessage}
            />
            <ChatScrollAnchor trackVisibility={state.isGenerating} />
          </>
        ) : null}
      </main>

      <ChatPanel
        id={id}
        isLoading={state.isLoading}
        messages={showMessage}
        prompt={state.prompt}
        setPrompt={value => dispatch({ type: "SET_PROMPT", payload: value })}
        type={type}
        title={title}
        createdAt={createdAt}
        fileId={fileId || state.currentChat?.file_id}
      />
    </>
  )
}
