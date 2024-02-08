import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { admin } from "@/lib/data/admin"
import { createClientServer } from "@/lib/supabase/server"

import MarketingHeader from "@/components/marketing/header"

export default async function InternalLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // if email not in admin set, redirect to home
  if (!admin.has(session.user.email || "")) {
    redirect("/")
  }

  return (
    <CurrentUserContextProvider session={session}>
      <MarketingHeader />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Suspense>{children}</Suspense>
      </main>
    </CurrentUserContextProvider>
  )
}
