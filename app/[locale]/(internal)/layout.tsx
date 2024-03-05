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
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // if email not in admin set, redirect to home
  if (!admin.has(user.email || "")) {
    redirect("/")
  }

  return (
    <CurrentUserContextProvider user={user}>
      <MarketingHeader />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </CurrentUserContextProvider>
  )
}
