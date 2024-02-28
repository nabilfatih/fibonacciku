import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"

import MarketingFooter from "@/components/marketing/footer"
import MarketingHeader from "@/components/marketing/header"
import MarketingHome from "@/components/marketing/home"

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/chat/assistant")
  }

  return (
    <CurrentUserContextProvider session={session}>
      <MarketingHeader />
      <main className="flex flex-1 flex-col overflow-hidden">
        <MarketingHome />
      </main>
      <MarketingFooter />
    </CurrentUserContextProvider>
  )
}
