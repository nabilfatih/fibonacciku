import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import BookCollections from "@/components/book/collections"

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Book")

  return {
    title: t("book-collection"),
    alternates: {
      canonical: "/book/collection",
      languages: {
        en: "/en/book/collection",
        id: "/id/book/collection",
        de: "/de/book/collection",
        ru: "/ru/book/collection"
      }
    }
  }
}

export default async function BookCollectionPage({ searchParams }: Props) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  const lang = searchParams.lang as string

  // get all books
  const { data: books } = await supabase
    .from("books_collection")
    .select("*")
    .order("created_at", { ascending: false })

  if (!books) {
    notFound()
  }

  let booksFiltered = books
  // filter books by search params
  if (lang) {
    booksFiltered = books.filter(book => book.lang === lang)
  }

  return <BookCollections books={booksFiltered} language={lang} />
}
