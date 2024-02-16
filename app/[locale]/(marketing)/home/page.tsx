import Link from "next/link"
import { IconRocket } from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import Particles from "@/components/ui/particles"
import MarketingTransition from "@/components/marketing/transition"

export default async function HomePage() {
  const t = await getScopedI18n("Home")

  return (
    <MarketingTransition>
      <div className="relative min-h-[calc(100dvh-4rem)]">
        <Particles
          className="animate-fade-in pointer-events-none absolute inset-0"
          quantity={30}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="mx-auto mb-4 max-w-4xl text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text pb-4 text-6xl font-bold tracking-tighter text-transparent sm:text-9xl">
              {t("slogan")}
            </h1>
            <p className="mx-auto max-w-xl text-balance text-lg sm:text-xl md:max-w-2xl">
              {t("header-desc-1")}
            </p>
            <div className="mt-4 flex flex-row justify-center gap-2">
              <Button asChild>
                <Link href="/chat/assistant">
                  <IconRocket className="mr-2 h-5 w-5" />
                  {t("get-started")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MarketingTransition>
  )
}
