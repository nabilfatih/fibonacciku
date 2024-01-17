import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import AccountGeneral from "@/components/account/general"
import AccountHeader from "@/components/account/header"
import AccountSubscription from "@/components/account/subscription"
import AccountSystem from "@/components/account/system"

export default async function AccountPage() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect("/auth/login?next=/account")
  }

  return (
    <main className="h-full space-y-4 overflow-y-auto overflow-x-hidden pb-6">
      <AccountHeader text="account" />

      <Suspense>
        <AccountGeneral userId={session.user.id} />

        <AccountSubscription userId={session.user.id} />

        <AccountSystem />
      </Suspense>
    </main>
  )
}
