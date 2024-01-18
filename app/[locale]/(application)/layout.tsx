import { Suspense } from "react"
import { cookies } from "next/headers"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"

import { HeaderChat } from "@/components/header"

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <CurrentUserContextProvider session={session}>
      <HeaderChat />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Suspense>{children}</Suspense>
      </main>
    </CurrentUserContextProvider>
  )
}
