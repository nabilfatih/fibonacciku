import type { Metadata } from "next"
import Link from "next/link"
import { IconMail, IconSparkles } from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import Particles from "@/components/ui/particles"
import MarketingTransition from "@/components/marketing/transition"
import { pluginsList } from "@/components/premium/plugins"

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/home",
      languages: {
        en: "/en/home",
        id: "/id/home",
        de: "/de/home",
        ru: "/ru/home"
      }
    }
  }
}

export default async function HomePage() {
  const t = await getScopedI18n("Home")

  return (
    <MarketingTransition className="relative">
      <Particles
        className="pointer-events-none absolute inset-0 animate-fade-in"
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
              <IconSparkles className="mr-1 h-4 w-4" />
              {t("get-started")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <IconMail className="mr-1 h-4 w-4" />
              {t("contact-us")}
            </Link>
          </Button>
        </div>

        <div className="pt-12 text-center">
          <p className="mx-auto max-w-xs text-balance text-sm">
            {t("slogan-1")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-16">
            {pluginsList.map((plugin, index) => {
              return (
                <div key={index} className="rounded-xl bg-muted p-2">
                  <plugin.icon className="h-5 w-5" />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </MarketingTransition>
  )
}
