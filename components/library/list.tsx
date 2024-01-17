"use client"

import type { Libraries } from "@/types/types"
import { useRef } from "react"
import { AnimatePresence, LayoutGroup } from "framer-motion"
import { ViewportList } from "react-viewport-list"
import LibraryCard from "@/components/library/card"

type Props = {
  parentRef: React.MutableRefObject<HTMLDivElement | null>
  libraries: Libraries[]
}

export default function LibraryList({ parentRef, libraries }: Props) {
  const listRef = useRef<any>({})
  return (
    <LayoutGroup>
      <AnimatePresence initial={false}>
        {libraries.length > 0 ? (
          <div className="relative mx-auto max-w-2xl px-4 sm:px-5">
            <ViewportList
              ref={listRef}
              viewportRef={parentRef}
              items={libraries}
            >
              {item => {
                return <LibraryCard key={item.id} library={item} />
              }}
            </ViewportList>
          </div>
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  )
}
