"use client"

import type { BookDocumentWithBooks } from "@/components/book/search"
import { cn } from "@/lib/utils"
import { useRef } from "react"
import BookPanel from "@/components/book/panel"
import BookList from "@/components/book/list"

type Props = {
  books: BookDocumentWithBooks[]
  document: string
  query: string
  className?: string
}

export default function BookContent({
  books,
  query,
  document,
  className
}: Props) {
  const bookRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <main
        ref={bookRef}
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10",
          className
        )}
      >
        <BookList bookRef={bookRef} books={books} />
      </main>

      <BookPanel />
    </>
  )
}
