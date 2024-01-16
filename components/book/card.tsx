import { getBooksCoverPublicUrl } from "@/lib/supabase/client/book"
import type { BookDocumentWithBooks } from "@/components/book/search"
import Image from "next/image"
import Link from "next/link"
import BookCardDescription from "@/components/book/card-description"
import BookCardText from "@/components/book/card-text"

type Props = {
  book: BookDocumentWithBooks
}

export default function BookCard({ book }: Props) {
  const dataBook = book.books

  const coverUrl = getBooksCoverPublicUrl(book.bookId, book.fileId)

  return (
    <div className="flex items-start sm:px-1">
      <div className="relative mr-2 h-24 w-16 flex-none sm:mr-4 sm:h-48 sm:w-36">
        <Image
          src={coverUrl}
          alt={dataBook.title}
          sizes="144px"
          fill
          priority
          className="rounded-xl border shadow-sm object-cover bg-muted/90"
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-col">
          <Link
            href={`/book/collection/${book.bookId}`}
            passHref
            className="mb-2 sm:text-lg font-medium tracking-tight leading-none w-fit"
          >
            {dataBook.title}
          </Link>

          <BookCardDescription book={dataBook} />

          <BookCardText book={book} />
        </div>
      </div>
    </div>
  )
}
