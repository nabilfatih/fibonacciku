"use client"

import { useCallback, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

import type { Chat, ChatMessage, Features } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { getBooksFileSignedUrl } from "@/lib/supabase/client/book"
import { getChatDocumentSignedUrl } from "@/lib/supabase/client/chat"
import { cn } from "@/lib/utils"

import ChatScrollAnchor from "@/components/chat/scroll-anchor"

const ChatPanel = dynamic(() => import("@/components/chat/panel"))
const ChatList = dynamic(() => import("@/components/chat/list"))
const EmptyScreen = dynamic(() => import("@/components/chat/empty-screen"))

export interface ChatProps extends React.ComponentProps<"div"> {
  type: Features
  chat?: Chat
  initialMessages?: ChatMessage[]
  id?: string
  userId?: string
  title?: string
  fileId?: string | null
  createdAt?: string
}

export default function ChatMessage({
  id,
  chat,
  userId,
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

  const fetchChatFile = useCallback(
    async (userId: string, fileId: string, type: Features) => {
      let dataFile: string | null = null
      if (type === "document") {
        dataFile = await getChatDocumentSignedUrl(userId, fileId)
      }
      if (type === "book") {
        const [bookId, bookFileId] = fileId.split("--") // bookId--bookFileId -> this is keyId
        dataFile = await getBooksFileSignedUrl(bookId, bookFileId)
      }
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: dataFile })
    },
    [dispatch]
  )

  useEffect(() => {
    if (initialMessages) {
      stop()
      setIndexMessage([])
      setShowMessage(initialMessages)
      dispatch({ type: "SET_CURRENT_CHAT", payload: chat || null })
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null })
      if (fileId && userId) {
        fetchChatFile(userId, fileId, type)
      }
    } else {
      stop()
      setShowMessage([])
      setIndexMessage([])
      dispatch({ type: "SET_CURRENT_CHAT", payload: null })
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null })
    }
    return () => {
      stop()
      setShowMessage([])
      setIndexMessage([])
      dispatch({ type: "SET_CURRENT_CHAT", payload: null })
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null })
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
        fileId={fileId}
      />
    </>
  )
}
