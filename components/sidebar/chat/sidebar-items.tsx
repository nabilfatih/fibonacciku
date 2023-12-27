"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import type { Chat } from "@/types/types";
import { useRef, type MutableRefObject } from "react";
import { ViewportList } from "react-viewport-list";
import { SidebarItem } from "@/components/sidebar/chat/sidebar-item";

type SidebarItemsProps = {
  chats: Chat[];
  ref: MutableRefObject<HTMLDivElement | null>;
};

export function SidebarItems({ chats, ref }: SidebarItemsProps) {
  const listRef = useRef(null);

  return (
    <div className="relative flex flex-col">
      <LayoutGroup>
        <AnimatePresence>
          <ViewportList ref={listRef} viewportRef={ref} items={chats}>
            {(item, index) => (
              <motion.div
                key={item.id}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
              >
                <SidebarItem index={index} chat={item}>
                  <div>
                    {
                      // TODO: Action buttons
                    }
                  </div>
                </SidebarItem>
              </motion.div>
            )}
          </ViewportList>
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
