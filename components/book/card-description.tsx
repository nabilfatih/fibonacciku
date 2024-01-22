import { IconPointFilled } from "@tabler/icons-react"

import type { Books } from "@/types/types"
import { useCurrentLocale, useScopedI18n } from "@/locales/client"

import { Badge } from "@/components/ui/badge"

type Props = {
  book: Books
}

export default function BookCardDescription({ book }: Props) {
  const t = useScopedI18n("CardBook")
  const locale = useCurrentLocale()
  // get list of authors by splitting string with comma
  const authors = book.authors?.trim().split(",") || []
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <Badge>{t(book.type as never)}</Badge>
      <Badge variant="secondary">{t(book.lang as never)}</Badge>

      {authors.map((author, index) => {
        // return 3 first authors, then add et al.
        if (index < 2) {
          return (
            <Badge variant="outline" key={index}>
              {author}
            </Badge>
          )
        } else if (index === 2) {
          return (
            <Badge variant="outline" key={index}>
              et al.
            </Badge>
          )
        }
      })}

      <IconPointFilled className="h-2 w-2 text-muted-foreground" />

      <span className="text-xs text-muted-foreground">
        {book.published_date
          ? new Date(book.published_date).toLocaleDateString(locale, {
              month: "short",
              year: "numeric"
            })
          : "N/A"}
      </span>
    </div>
  )
}
