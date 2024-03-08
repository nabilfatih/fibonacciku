import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import { createClientServer } from "@/lib/supabase/server"

export default async function DetectorAiPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/detector/ai")
  }

  return <main></main>
}
