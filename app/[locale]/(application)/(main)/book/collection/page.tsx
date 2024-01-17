import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Book")

  return {
    title: t("book-collection"),
    alternates: {
      canonical: "/book/collection",
      languages: {
        en: "/en/book/collection",
        id: "/id/book/collection",
        de: "/de/book/collection"
      }
    }
  }
}

export default async function BookCollectionPage() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  // get all books
  const { data: books } = await supabase
    .from("books_collection")
    .select("*")
    .order("created_at", { ascending: false })

  if (!books) {
    notFound()
  }

  return <main></main>
}
