import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import LibraryDocument from "@/components/library"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Library")

  return {
    title: t("library"),
    alternates: {
      canonical: "/library",
      languages: {
        en: "/en/library",
        id: "/id/library",
        de: "/de/library",
        ru: "/ru/library",
        nl: "/nl/library",
        it: "/it/library"
      }
    }
  }
}

export default async function ChatLibraryPage() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/library")
  }

  const { data: libraries } = await supabase
    .from("libraries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (!libraries) {
    notFound()
  }

  return <LibraryDocument libraries={libraries} />
}
