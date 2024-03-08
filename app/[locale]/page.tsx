import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"
import { getStaticParams } from "@/locales/server"

import MarketingFooter from "@/components/marketing/footer"
import MarketingHeader from "@/components/marketing/header"
import MarketingHome from "@/components/marketing/home"

export function generateStaticParams() {
  return getStaticParams()
}

export default async function Home({
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

  if (user) {
    redirect("/chat/assistant")
  }

  return (
    <CurrentUserContextProvider user={user}>
      <MarketingHeader />
      <main className="flex flex-1 flex-col overflow-hidden">
        <MarketingHome />
      </main>
      <MarketingFooter />
    </CurrentUserContextProvider>
  )
}
