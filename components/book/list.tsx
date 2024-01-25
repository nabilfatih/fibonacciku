import { useRef } from "react"
import type { MutableRefObject } from "react"
import { ViewportList } from "react-viewport-list"

import { Separator } from "@/components/ui/separator"
import BookCard from "@/components/book/card"
import type { BookDocumentWithBooks } from "@/components/book/search"

type Props = {
  bookRef: MutableRefObject<HTMLDivElement | null>
  books: BookDocumentWithBooks[]
}

export default function BookList({ bookRef, books }: Props) {
  const listRef = useRef<any>({})
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <ViewportList
        ref={listRef}
        viewportRef={bookRef}
        items={books}
        overscan={5}
      >
        {(item, index) => {
          return (
            <div key={item.bookId}>
              <BookCard key={item.bookId} book={item} />
              {index < books.length - 1 && (
                <Separator className="my-4 md:my-8" />
              )}
            </div>
          )
        }}
      </ViewportList>
    </div>
  )
}
