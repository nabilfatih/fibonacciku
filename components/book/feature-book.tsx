import { cookies } from "next/headers"
import Link from "next/link"

import { getBooksCoverPublicUrl } from "@/lib/supabase/client/book"
import { createClientServer } from "@/lib/supabase/server"
import { getCurrentLocale, getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import BookCardImage from "@/components/book/card-image"

export default async function FeatureBook() {
  const t = await getScopedI18n("EmptyScreen")
  const locale = getCurrentLocale()

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  // get latest 4 books
  const { data } = await supabase
    .from("books_collection")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  if (!data) return null

  return (
    <section className="grid">
      <h2 className="mb-2 font-medium tracking-tight">
        {t("our-latest-book")}
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.map(book => {
          const publishedDate = book.published_date
            ? new Date(book.published_date).toLocaleDateString(locale, {
                month: "long",
                year: "numeric"
              })
            : "N/A"

          const coverUrl = getBooksCoverPublicUrl(book.id, book.file_id)
          return (
            <Link
              href={`/book/collection/${book.id}`}
              key={book.id}
              className="flex flex-col justify-between gap-2"
              passHref
            >
              <BookCardImage
                src={coverUrl}
                title={book.title}
                className="relative h-52 w-auto sm:h-48"
              />

              <div className="grid">
                <p className="truncate text-sm">{book.title}</p>
                <span className="truncate text-xs text-muted-foreground">
                  {publishedDate}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <Button
        asChild
        variant="outline"
        className="mx-auto flex justify-center sm:w-fit"
      >
        <Link href="/book/collection">{t("see-our-collection")}</Link>
      </Button>
    </section>
  )
}
