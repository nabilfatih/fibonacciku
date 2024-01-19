import { useMemo, type MutableRefObject } from "react"
import { ViewportList } from "react-viewport-list"

import type { IndexMessage, ShowChatMessage } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"

import { Separator } from "@/components/ui/separator"
import ChatMessages from "@/components/chat/message"

type Props = {
  chatMessageRef: MutableRefObject<HTMLDivElement | null>
  messages: ShowChatMessage[]
  indexMessage: IndexMessage[]
}

function ListContent({
  item,
  index,
  indexMessage
}: {
  item: ShowChatMessage
  index: number
  indexMessage: IndexMessage[]
}) {
  const currentIndex = useMemo(() => {
    return indexMessage.find(item => item.index === index) as IndexMessage
  }, [indexMessage, index])

  return (
    <ChatMessages index={index} message={item} currentIndex={currentIndex} />
  )
}

export default function ChatList({
  chatMessageRef,
  messages,
  indexMessage
}: Props) {
  const { messageRef, dispatch } = useMessage()
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <ViewportList
        ref={messageRef}
        viewportRef={chatMessageRef}
        items={messages}
        initialIndex={messages.length}
        initialOffset={208}
        initialAlignToTop={false}
        overscan={5} // reduce glitch (this happen in mobile)
        onViewportIndexesChange={indexes => {
          dispatch({ type: "SET_SCROLL_POSITION", payload: indexes[0] })
        }}
      >
        {(item, index) => {
          return (
            <div key={index}>
              <ListContent
                item={item}
                index={index}
                indexMessage={indexMessage}
              />
              {index < messages.length - 1 && item.role !== "system" && (
                <Separator className="my-4 md:my-8" />
              )}
            </div>
          )
        }}
      </ViewportList>
    </div>
  )
}
