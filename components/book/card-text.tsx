import Link from "next/link"

import { useScopedI18n } from "@/locales/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import BookCardTextContent from "@/components/book/card-text-content"
import type { BookDocumentWithBooks } from "@/components/book/search"

type Props = {
  book: BookDocumentWithBooks
}

export default function BookCardText({ book }: Props) {
  const t = useScopedI18n("CardBook")

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{t("most-relevant-text")}</Badge>
        <span className="text-xs font-medium">{t("page")}</span>
        <Button asChild size="sm" className="rounded-full">
          <Link
            href={`/book/collection/${book.bookId}?page=${book.data[0].metadata.page_number}`}
          >
            {book.data[0].metadata.page_number}
          </Link>
        </Button>
      </div>

      <BookCardTextContent book={book} />

      {
        // if book has more than 1 page
        book.data.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{t("other-relevant-text")}</Badge>
            <span className="text-xs font-medium">{t("page")}</span>
            {
              // map start from index 1 until end of array
              book.data
                .slice(1)
                .sort((a, b) => {
                  return a.metadata.page_number - b.metadata.page_number
                })
                .map((page, index) => (
                  <Button
                    key={index}
                    asChild
                    size="sm"
                    className="rounded-full"
                  >
                    <Link
                      href={`/book/collection/${book.bookId}?page=${page.metadata.page_number}`}
                    >
                      {page.metadata.page_number}
                    </Link>
                  </Button>
                ))
            }
          </div>
        )
      }

      <Button asChild size="sm" variant="link" className="p-0">
        <Link href={`/book/collection/${book.bookId}`}>{t("read-more")}</Link>
      </Button>
    </div>
  )
}
