import { getScopedI18n } from "@/locales/server"

import Particles from "@/components/ui/particles"
import MarketingTransition from "@/components/marketing/transition"

export default async function HomePage() {
  const t = await getScopedI18n("Home")

  return (
    <MarketingTransition>
      <div className="relative min-h-[calc(100dvh-4rem)]">
        <Particles
          className="pointer-events-none absolute inset-0"
          quantity={30}
        />
      </div>
    </MarketingTransition>
  )
}
