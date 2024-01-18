"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

import BookAssistant from "@/components/book/assistant"
import BookList from "@/components/book/list"
import BookPanel from "@/components/book/panel"
import type { BookDocumentWithBooks } from "@/components/book/search"

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
          "h-full space-y-4 overflow-y-auto overflow-x-hidden pb-48 sm:pb-52",
          className
        )}
      >
        <BookAssistant query={query} document={document} />
        <BookList bookRef={bookRef} books={books} />
      </main>

      <BookPanel />
    </>
  )
}
