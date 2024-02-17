import Link from "next/link"
import {
  IconBooks,
  IconBrandWikipedia,
  IconBrandYoutube,
  IconMath,
  IconPhoto,
  IconSitemap,
  IconSparkles,
  IconWind,
  IconWorldWww
} from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import Particles from "@/components/ui/particles"
import MarketingTransition from "@/components/marketing/transition"

export default async function HomePage() {
  const t = await getScopedI18n("Home")

  return (
    <MarketingTransition>
      <main className="relative min-h-[calc(100dvh-4rem)]">
        <Particles
          className="animate-fade-in pointer-events-none absolute inset-0 hidden md:block"
          quantity={30}
        />

        <section className="mx-auto max-w-7xl px-4 py-28">
          <header className="text-center">
            <h1 className="mx-auto mb-4 max-w-4xl text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text pb-4 text-6xl font-bold tracking-tighter text-transparent sm:text-9xl">
              {t("slogan")}
            </h1>
            <p className="mx-auto max-w-xl text-balance text-lg sm:text-xl md:max-w-2xl">
              {t("header-desc-1")}
            </p>
          </header>

          <div className="mt-4 flex flex-row justify-center gap-2">
            <Button asChild>
              <Link href="/chat/assistant">
                <IconSparkles className="mr-1 h-5 w-5" />
                {t("get-started")}
              </Link>
            </Button>
          </div>

          <div className="pt-12 text-center">
            <p className="mx-auto max-w-xs text-balance text-sm">
              {t("slogan-1")}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-16">
              <div className="rounded-xl bg-muted p-2">
                <IconPhoto className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconMath className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconWorldWww className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconBrandYoutube className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconBooks className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconWind className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconSitemap className="h-5 w-5" />
              </div>
              <div className="rounded-xl bg-muted p-2">
                <IconBrandWikipedia className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingTransition>
  )
}
