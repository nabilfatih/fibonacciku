import { cookies } from "next/headers"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"

import HeaderChat from "@/components/header"
import MarketingHeader from "@/components/marketing/header"

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <CurrentUserContextProvider user={user}>
      {user ? <HeaderChat /> : <MarketingHeader />}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </CurrentUserContextProvider>
  )
}
