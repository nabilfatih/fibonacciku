import { getBooksCoverPublicUrl } from "@/lib/supabase/client/book"
import { createClientServer } from "@/lib/supabase/server"
import { getCurrentLocale } from "@/locales/server"
import moment from "moment"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function FeatureBook() {
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
    <section className="max-w-xs sm:max-w-none">
      <h2 className="mb-2 font-semibold tracking-tight">Our latest books:</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
        {data.map(book => {
          const publishedDate = moment(book.published_date)
            .locale(locale)
            .format("MMMM YYYY")

          const coverUrl = getBooksCoverPublicUrl(book.id, book.file_id)
          return (
            <Link
              href={`/book/collection/${book.id}`}
              key={book.id}
              className="flex flex-col justify-between gap-2"
            >
              <div className="relative w-auto h-48">
                <Image
                  src={coverUrl}
                  alt={book.title}
                  priority
                  fill
                  className="rounded-lg border shadow-sm object-cover"
                />
              </div>

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
        className="flex justify-center sm:w-fit mx-auto"
      >
        <Link href="/book/collection">See our collection</Link>
      </Button>
    </section>
  )
}
