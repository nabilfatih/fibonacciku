import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  IconClick,
  IconGlobe,
  IconLeaf,
  IconMail,
  IconMoodWink,
  IconSparkles,
  type TablerIconsProps
} from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import MarketingTransition from "@/components/marketing/transition"

import sustainBackground from "/public/background-sustain.webp"

// Define a new type for the IconInfo
type IconInfo = {
  IconComponent: (props: TablerIconsProps) => JSX.Element
  titleKey: string
  descKey: string
}

// Define the icons and their corresponding keys in an array
const iconsInfo: IconInfo[] = [
  {
    IconComponent: IconGlobe,
    titleKey: "accessible",
    descKey: "accessible-desc"
  },
  {
    IconComponent: IconClick,
    titleKey: "convenient",
    descKey: "convenient-desc"
  },
  {
    IconComponent: IconMoodWink,
    titleKey: "enjoyable",
    descKey: "enjoyable-desc"
  }
]

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("MarketingAbout")
  return {
    title: t("about"),
    description: `${t("title")}. ${t("title-desc")}`,
    alternates: {
      canonical: "/about",
      languages: {
        en: "/en/about",
        id: "/id/about",
        de: "/de/about",
        ru: "/ru/about"
      }
    }
  }
}

export default async function AboutPage() {
  const t = await getScopedI18n("MarketingAbout")
  const tHome = await getScopedI18n("Home")

  return (
    <MarketingTransition className="relative">
      <section className="py-36">
        <div className="mx-auto max-w-7xl px-4">
          <header className="text-center">
            <span className="mx-auto uppercase tracking-widest text-muted-foreground">
              {t("our-mission")}
            </span>
            <h1 className="mx-auto mb-6 mt-2 max-w-4xl bg-gradient-to-r from-foreground to-primary bg-clip-text pb-4 text-5xl font-bold tracking-tighter text-transparent sm:text-7xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-xl text-balance text-lg sm:text-xl md:max-w-2xl">
              {t("title-desc")}
            </p>
          </header>

          <div className="mx-auto my-16 grid grid-cols-1 items-start justify-center gap-10 sm:grid-cols-2 md:my-20 md:grid-cols-3 md:flex-row lg:my-24 lg:gap-2">
            {iconsInfo.map((iconInfo, index) => (
              <div className="px-2" key={index}>
                <div className="flex flex-row items-start justify-center gap-4">
                  <div className="rounded-xl bg-muted p-2">
                    <iconInfo.IconComponent className="h-6 w-6" />
                  </div>
                  <div className="max-w-[18rem]">
                    <h2 className="text-lg font-semibold leading-none sm:text-2xl">
                      {t(iconInfo.titleKey as never)}
                    </h2>
                    <p className="text-sm text-muted-foreground sm:text-base">
                      {t(iconInfo.descKey as never)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-36">
        <div className="mx-auto max-w-7xl space-y-12 px-4">
          <header className="relative space-y-2">
            <h1 className="text-4xl font-semibold tracking-tighter">
              {t("sustain-title")}
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              {t("sustain-desc")}
            </p>
            <Button asChild>
              <Link href="https://climate.stripe.com/kctMgY" target="_blank">
                <IconLeaf className="mr-1 h-4 w-4" />
                {t("climate-action")}
              </Link>
            </Button>
          </header>

          <div className="relative h-64 w-full sm:h-[512px] lg:h-[768px]">
            <Image
              src={sustainBackground}
              sizes="100vw"
              fill
              alt="FibonacciKu"
              className="rounded-xl border object-cover object-center shadow"
              placeholder="blur"
            />
          </div>
        </div>
      </section>

      <section className="border-t py-36">
        <div className="mx-auto max-w-7xl px-4">
          <div className="space-y-2 text-center">
            <h1 className="mx-auto w-fit max-w-4xl text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-7xl">
              {tHome("just-ask-anything")}
            </h1>
            <p className="mx-auto max-w-lg text-balance text-sm sm:text-base md:max-w-2xl">
              {tHome("slogan")}
            </p>
          </div>
          <div className="mt-4 flex flex-row justify-center gap-2">
            <Button asChild>
              <Link href="/chat/assistant">
                <IconSparkles className="mr-1 h-4 w-4" />
                {tHome("get-started")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                <IconMail className="mr-1 h-4 w-4" />
                {tHome("contact-us")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingTransition>
  )
}
