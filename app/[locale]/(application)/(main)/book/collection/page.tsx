import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"
import type { Metadata } from "next"
import { cookies } from "next/headers"

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

  return <main></main>
}
