import { cookies } from "next/headers"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"
import { getStaticParams } from "@/locales/server"

import MarketingFooter from "@/components/marketing/footer"
import MarketingHeader from "@/components/marketing/header"

export function generateStaticParams() {
  return getStaticParams()
}

export default async function MarketingLayout({
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
      <MarketingHeader />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      <MarketingFooter />
    </CurrentUserContextProvider>
  )
}
