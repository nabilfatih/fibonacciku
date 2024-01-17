import { cookies } from "next/headers"

import type { Subscription } from "@/types/types"
import { createClientServer } from "@/lib/supabase/server"
import AccountSubscriptionEmpty from "@/components/account/subscription-empty"
import AccountSubscriptionManage from "@/components/account/subscription-manage"

type Props = {
  userId: string
}

export default async function AccountSubscription({ userId }: Props) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  const { data } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    // .in("status", ["trialing", "active"])
    .gt("current_period_end", new Date().toISOString())
    .eq("user_id", userId)
    .order("created_at", { ascending: false }) // get the latest subscription
    .limit(1)
    .maybeSingle()

  if (!data) {
    return <AccountSubscriptionEmpty />
  }

  // check with plan that user use, just the sake of simplicity in the frontend
  const plan = data.prices?.products?.name

  const today = new Date()
  const currentPeriodStart = new Date(data.current_period_start)
  const currentPeriodEnd = new Date(data.current_period_end)

  // Assuming the dates are in UTC, adjust them to the local timezone
  currentPeriodStart.setMinutes(
    currentPeriodStart.getMinutes() + currentPeriodStart.getTimezoneOffset()
  )
  currentPeriodEnd.setMinutes(
    currentPeriodEnd.getMinutes() + currentPeriodEnd.getTimezoneOffset()
  )

  const isActive = today <= currentPeriodEnd && today >= currentPeriodStart

  const subscription: Subscription = {
    ...data,
    isActive,
    planName: plan?.toLocaleLowerCase() || "free"
  }

  return (
    <section className="mx-auto max-w-2xl px-4">
      <AccountSubscriptionManage subscription={subscription} />
    </section>
  )
}
