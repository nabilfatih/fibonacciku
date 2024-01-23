"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

import type { BookDocumentWithBooks } from "@/components/book/search"

const BookList = dynamic(() => import("@/components/book/list"))
const BookAssistant = dynamic(() => import("@/components/book/assistant"))

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
  )
}
