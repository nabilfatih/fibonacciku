"use client"

import { memo, useRef, type MutableRefObject } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { ViewportList } from "react-viewport-list"

import type { Chat } from "@/types/types"

import SidebarActions from "@/components/sidebar/chat/sidebar-actions"
import SidebarItem from "@/components/sidebar/chat/sidebar-item"
import { removeChat, shareChat } from "@/app/actions/chat"

type SidebarItemsProps = {
  chats: Chat[]
  parentRef: MutableRefObject<HTMLDivElement | null>
}

function SidebarItems({ chats, parentRef }: SidebarItemsProps) {
  const listRef = useRef(null)

  return (
    <div className="relative flex flex-col">
      <LayoutGroup>
        <AnimatePresence initial={false}>
          <ViewportList ref={listRef} viewportRef={parentRef} items={chats}>
            {item => (
              <motion.div
                key={item.id}
                exit={{
                  opacity: 0,
                  height: 0
                }}
              >
                <SidebarItem chat={item}>
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
  )
}

export default memo(SidebarItems)
