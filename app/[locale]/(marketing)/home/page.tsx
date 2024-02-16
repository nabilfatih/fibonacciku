import { getScopedI18n } from "@/locales/server"

import MarketingTransition from "@/components/marketing/transition"

export default async function HomePage() {
  const t = await getScopedI18n("Home")

  return (
    <MarketingTransition>
      <div className="min-h-[calc(100dvh-4rem)]"></div>
    </MarketingTransition>
  )
}
