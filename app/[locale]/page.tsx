import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/chat/assistant")
  }

  redirect("/auth/login")
}
