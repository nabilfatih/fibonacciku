import { Suspense } from "react"
import { cookies } from "next/headers"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"

import { MarketingHeader } from "@/components/marketing/header"

export default async function MarketingLayout({
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
      <MarketingHeader />
      <Suspense>{children}</Suspense>
    </CurrentUserContextProvider>
  )
}
