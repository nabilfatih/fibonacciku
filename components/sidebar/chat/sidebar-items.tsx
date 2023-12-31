"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import type { Chat } from "@/types/types";
import { useRef, type MutableRefObject } from "react";
import { ViewportList } from "react-viewport-list";
import { SidebarItem } from "@/components/sidebar/chat/sidebar-item";
import SidebarActions from "@/components/sidebar/chat/sidebar-actions";
import { removeChat, shareChat } from "@/app/actions";

type SidebarItemsProps = {
  chats: Chat[];
  parentRef: MutableRefObject<HTMLDivElement | null>;
};

export function SidebarItems({ chats, parentRef }: SidebarItemsProps) {
  const listRef = useRef(null);

  return (
    <div className="relative flex flex-col">
      <LayoutGroup>
        <AnimatePresence>
          <ViewportList ref={listRef} viewportRef={parentRef} items={chats}>
            {(item, index) => (
              <motion.div
                key={item.id}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
              >
                <SidebarItem index={index} chat={item}>
                  <SidebarActions
                    chat={item}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              </motion.div>
            )}
          </ViewportList>
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
