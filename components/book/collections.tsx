import Link from "next/link"
import moment from "moment"

import type { Books } from "@/types/types"
import { getBooksCoverPublicUrl } from "@/lib/supabase/client/book"
import { cn } from "@/lib/utils"
import { getCurrentLocale } from "@/locales/server"

import BookCardImage from "@/components/book/card-image"
import BookPanel from "@/components/book/panel"

export interface BookCollectionsProps extends React.ComponentProps<"div"> {
  books: Books[]
}

export default function BookCollections({
  books,
  className
}: BookCollectionsProps) {
  const locale = getCurrentLocale()
  return (
    <>
      <main
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10",
          className
        )}
      >
        <div className="relative mx-auto max-w-sm px-4 sm:max-w-2xl">
          <section className="grid grid-cols-3 gap-6 sm:grid-cols-4 sm:gap-8 sm:px-1">
            {books.map((book, index) => {
              const publishedDate = moment(book.published_date)
                .locale(locale)
                .format("MMMM YYYY")

              const coverUrl = getBooksCoverPublicUrl(book.id, book.file_id)

              return (
                <div key={index} className="grid justify-center">
                  <Link
                    href={`/book/collection/${book.id}`}
                    passHref
                    className="relative grid w-auto gap-1 sm:w-auto"
                  >
                    <BookCardImage
                      src={coverUrl}
                      title={book.title}
                      className="h-32 w-auto sm:h-48 sm:w-auto"
                    />
                    <div className="grid">
                      <h2
                        title={book.title}
                        className="truncate text-sm font-medium tracking-tight"
                      >
                        {book.title}
                      </h2>
                      <p className="truncate text-xs text-muted-foreground">
                        {publishedDate}
                      </p>
                    </div>
                  </Link>
                </div>
              )
            })}
          </section>
        </div>
      </main>

      <BookPanel />
    </>
  )
}
