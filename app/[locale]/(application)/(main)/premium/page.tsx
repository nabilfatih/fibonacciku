import type { Metadata } from "next"
import { cookies } from "next/headers"

import type { Subscription } from "@/types/types"
import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import { Badge } from "@/components/ui/badge"
import PremiumFeatures from "@/components/premium/features"
import PremiumPlugins from "@/components/premium/plugins"
import PremiumPrice from "@/components/premium/price"

export function generateMetadata(): Metadata {
  return {
    title: "Premium",
    alternates: {
      canonical: "/premium",
      languages: {
        en: "/en/premium",
        id: "/id/premium",
        de: "/de/premium"
      }
    }
  }
}

export default async function PremiumPage() {
  const t = await getScopedI18n("MarketingPricing")

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  let subscription: Subscription | null = null

  if (session?.user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      // .in("status", ["trialing", "active"])
      .gt("current_period_end", new Date().toISOString())
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false }) // get the latest subscription
      .limit(1)
      .maybeSingle()

    if (data) {
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

      subscription = {
        ...data,
        isActive,
        planName: plan?.toLocaleLowerCase() || "free"
      }
    }
  }

  return (
    <main className="h-full space-y-4 overflow-y-auto overflow-x-hidden pb-6">
      <header className="border-b py-4">
        <div className="relative mx-auto max-w-4xl px-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold tracking-tighter">
              FibonacciKu
            </h2>
            <Badge className="ml-2">Premium</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">{t("desc-2")}</p>
        </div>
      </header>

      <PremiumPrice user={session?.user || null} subscription={subscription} />

      <PremiumFeatures />

      <section className="mx-auto max-w-4xl px-4">
        <div className="flex justify-center">
          <PremiumPlugins
            variant="outline"
            className="w-full sm:w-auto"
            text="See our plugins"
          />
        </div>
      </section>
    </main>
  )
}
