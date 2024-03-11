import { Suspense } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import { ScrollArea } from "@/components/ui/scroll-area"
import AccountGeneral from "@/components/account/general"
import AccountHeader from "@/components/account/header"
import AccountSubscription from "@/components/account/subscription"
import AccountSystem from "@/components/account/system"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("ModalAccount")
  return {
    title: t("account"),
    alternates: {
      languages: {
        en: "/en/account",
        id: "/id/account",
        de: "/de/account",
        ru: "/ru/account",
        nl: "/nl/account",
        it: "/it/account"
      }
    }
  }
}

export default async function AccountPage({
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
    redirect("/auth/login?next=/account")
  }

  return (
    <ScrollArea className="h-full">
      <main className="space-y-4 pb-6">
        <AccountHeader text="account" />

        <Suspense>
          <AccountGeneral userId={user.id} />

          <AccountSubscription userId={user.id} />

          <AccountSystem />
        </Suspense>
      </main>
    </ScrollArea>
  )
}
