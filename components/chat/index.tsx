"use client";

import { cn } from "@/lib/utils";
import ChatScrollAnchor from "@/components/chat/scroll-anchor";
import type { Chat, ChatMessage, ShowChatMessage } from "@/types/types";
import dynamic from "next/dynamic";
import { useMessage } from "@/lib/context/use-message";
import { downloadChatDocument } from "@/lib/supabase/client/chat";
import { useCallback, useEffect, useMemo, useRef } from "react";

const ChatPanel = dynamic(() => import("@/components/chat/panel"));
const ChatList = dynamic(() => import("@/components/chat/list"));
const EmptyScreen = dynamic(() => import("@/components/chat/empty-screen"));

export interface ChatProps extends React.ComponentProps<"div"> {
  type: "assistant" | "document";
  chat?: Chat;
  initialMessages?: ChatMessage[];
  id?: string;
  userId?: string;
  title?: string;
  fileId?: string | null;
  createdAt?: string;
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
  createdAt,
}: ChatProps) {
  const {
    showMessage,
    indexMessage,
    state,
    dispatch,
    setShowMessage,
    setIndexMessage,
  } = useMessage();

  const chatMessageRef = useRef<HTMLDivElement | null>(null);

  const showMessageSlice = useMemo(
    () => (type === "assistant" ? showMessage.slice(1) : showMessage),
    [showMessage, type]
  );

  const fetchChatDocument = useCallback(
    async (userId: string, fileId: string) => {
      const dataFile = await downloadChatDocument(userId, fileId);
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: dataFile });
    },
    [dispatch]
  );

  useEffect(() => {
    if (initialMessages) {
      setIndexMessage([]);
      setShowMessage(initialMessages);
      dispatch({ type: "SET_CURRENT_CHAT", payload: chat || null });
      if (fileId && userId) {
        fetchChatDocument(userId, fileId);
      }
    } else {
      setIndexMessage([]);
      setShowMessage([]);
      dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages]);

  return (
    <>
      <div
        ref={chatMessageRef}
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10",
          className
        )}
      >
        {!id && showMessageSlice.length === 0 && <EmptyScreen type={type} />}

        {showMessageSlice.length > 0 && indexMessage.length > 0 ? (
          <>
            <ChatList
              chatMessageRef={chatMessageRef}
              messages={showMessageSlice}
              indexMessage={indexMessage}
              type={type}
            />
            <ChatScrollAnchor trackVisibility={state.isGenerating} />
          </>
        ) : null}
      </div>

      <ChatPanel
        id={id}
        isLoading={state.isLoading}
        messages={(initialMessages as ShowChatMessage[]) || []}
        prompt={state.prompt}
        setPrompt={value => dispatch({ type: "SET_PROMPT", payload: value })}
        type={type}
        title={title}
        createdAt={createdAt}
      />
    </>
  );
}
