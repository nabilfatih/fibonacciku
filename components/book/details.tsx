import type { Books } from "@/types/types"
import { useCurrentLocale, useScopedI18n } from "@/locales/client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

type Props = {
  book: Books
}

export default function BookDetails({ book }: Props) {
  const t = useScopedI18n("CollectionBook")
  const locale = useCurrentLocale()
  const authors = book.authors?.trim().split(",") || []

  return (
    <div className="relative py-2">
      <section className="grid gap-4">
        <div className="grid">
          <Label className="text-xs text-muted-foreground">Title</Label>
          <h3 className="font-medium leading-none tracking-tight">
            {book.title}
          </h3>
        </div>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{t(book.type as never)}</Badge>
            <Badge variant="secondary">{t(book.lang as never)}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {authors.map((author, index) => {
              return (
                <Badge variant="outline" key={index}>
                  {author}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="grid">
          <Label className="text-xs text-muted-foreground">
            {t("publisher")}
          </Label>
          <p className="text-sm tracking-tight">{book.publisher}</p>
        </div>

        <div className="grid">
          <Label className="text-xs text-muted-foreground">{t("isbn")}</Label>
          <p className="text-sm tracking-tight">
            {book.isbn ? book.isbn : "N/A"}
          </p>
        </div>

        <div className="grid">
          <Label className="text-xs text-muted-foreground">
            {t("published-date")}
          </Label>
          <p className="text-sm tracking-tight">
            {book.published_date
              ? new Date(book.published_date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              : "N/A"}
          </p>
        </div>
      </section>
    </div>
  )
}
