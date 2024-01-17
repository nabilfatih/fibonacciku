import { Suspense } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getScopedI18n } from "@/locales/server"

import { createClientServer } from "@/lib/supabase/server"
import BookEmptyScreen from "@/components/book/empty-screen"
import FeatureBook from "@/components/book/feature-book"
import BookPanel from "@/components/book/panel"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("ProductFiboBook")

  return {
    title: {
      absolute: t("fibo-book")
    },
    description: `${t("header")}. ${t("fibo-book-description")}`,
    alternates: {
      canonical: "/book",
      languages: {
        en: "/en/book",
        id: "/id/book",
        ms: "/de/book"
      }
    }
  }
}

export default async function BookPage() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect("/auth/login?next=/book")
  }

  return (
    <>
      <main className="h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10">
        <BookEmptyScreen>
          <Suspense>
            <FeatureBook />
          </Suspense>
        </BookEmptyScreen>
      </main>

      <BookPanel />
    </>
  )
}
