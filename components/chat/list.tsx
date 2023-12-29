import type { IndexMessage, ShowChatMessage } from "@/types/types";
import { useMemo, type MutableRefObject } from "react";
import { ViewportList } from "react-viewport-list";
import { useMessage } from "@/lib/context/use-message";
import ChatMessages from "@/components/chat/message";
import { Separator } from "@/components/ui/separator";

type Props = {
  chatMessageRef: MutableRefObject<HTMLDivElement | null>;
  messages: ShowChatMessage[];
  indexMessage: IndexMessage[];
  type: "assistant" | "document";
};

function ListContent({
  item,
  index,
  type,
  indexMessage,
}: {
  item: ShowChatMessage;
  index: number;
  type: "assistant" | "document";
  indexMessage: IndexMessage[];
}) {
  const currentIndex = useMemo(() => {
    return indexMessage.find(
      (item) => item.index === (type === "document" ? index : index + 1)
    ) as IndexMessage;
  }, [indexMessage, type, index]);

  return (
    <ChatMessages
      index={index}
      message={item}
      currentIndex={currentIndex}
      type={type}
    />
  );
}

export default function ChatList({
  chatMessageRef,
  messages,
  indexMessage,
  type,
}: Props) {
  const { messageRef } = useMessage();
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <ViewportList
        ref={messageRef}
        viewportRef={chatMessageRef}
        items={messages}
        initialIndex={messages.length}
        initialOffset={208}
        initialAlignToTop={false}
        overscan={3}
      >
        {(item, index) => {
          return (
            <div key={index}>
              <ListContent
                item={item}
                index={index}
                indexMessage={indexMessage}
                type={type}
              />
              {index < messages.length - 1 && (
                <Separator className="my-4 md:my-8" />
              )}
            </div>
          );
        }}
      </ViewportList>
    </div>
  );
}
