import type { Metadata } from "next"
import { cookies } from "next/headers"
import { setStaticParamsLocale } from "next-international/server"

import type { Subscription } from "@/types/types"
import { createClientServer } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { getScopedI18n } from "@/locales/server"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import MarketingCta from "@/components/marketing/cta"
import MarketingFooter from "@/components/marketing/footer"
import PremiumCompare from "@/components/premium/compare"
import PremiumFeatures from "@/components/premium/features"
import PremiumPrice from "@/components/premium/price"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("MarketingPricing")
  return {
    title: t("premium"),
    description: t("premium-desc"),
    alternates: {
      languages: {
        en: "/en/premium",
        id: "/id/premium",
        de: "/de/premium",
        ru: "/ru/premium",
        nl: "/nl/premium",
        it: "/it/premium"
      }
    }
  }
}

export default async function PremiumPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  const t = await getScopedI18n("MarketingPricing")

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  let subscription: Subscription | null = null

  if (user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .gt("current_period_end", new Date().toISOString())
      .eq("user_id", user.id)
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
    <ScrollArea className="h-full">
      <main className="space-y-6">
        <header className="border-b py-4">
          <div
            className={cn(
              "relative mx-auto max-w-4xl px-4",
              !user && "max-w-7xl"
            )}
          >
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold tracking-tighter">
                FibonacciKu
              </h2>
              <Badge className="ml-2">{t("premium")}</Badge>
            </div>
            <p className="mt-2 text-muted-foreground">{t("desc-2")}</p>
          </div>
        </header>

        <section
          className={cn(
            "relative mx-auto max-w-4xl px-4",
            !user && "max-w-7xl"
          )}
        >
          <PremiumPrice user={user || null} subscription={subscription} />
        </section>

        <section
          className={cn(
            "relative mx-auto max-w-4xl px-4",
            !user && "max-w-7xl"
          )}
        >
          <PremiumFeatures />
        </section>

        <section
          className={cn(
            "relative mx-auto max-w-4xl px-4 pb-12 pt-6",
            !user && "max-w-7xl"
          )}
        >
          <div className="flex items-center pb-6">
            <h2 className="text-2xl font-semibold tracking-tighter">
              {t("compare-features-across-plans")}
            </h2>
          </div>
          <PremiumCompare />
        </section>
        {!user && (
          <>
            <MarketingCta />
            <MarketingFooter />
          </>
        )}
      </main>
    </ScrollArea>
  )
}
