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
      canonical: "/chat/library",
      languages: {
        en: "/en/chat/library",
        id: "/id/chat/library",
        de: "/de/chat/library",
        ru: "/ru/chat/library"
      }
    }
  }
}

export default async function ChatLibraryPage() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect("/auth/login?next=/chat/library")
  }

  const { data: libraries } = await supabase
    .from("libraries")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(1000)

  if (!libraries) {
    notFound()
  }

  return <LibraryDocument libraries={libraries} />
}
