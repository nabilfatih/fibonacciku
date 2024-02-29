import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  IconClick,
  IconGlobe,
  IconLeaf,
  IconMoodWink,
  type TablerIconsProps
} from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import Particles from "@/components/ui/particles"
import MarketingCta from "@/components/marketing/cta"
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
        ru: "/ru/about",
        nl: "/nl/about"
      }
    }
  }
}

export default async function AboutPage() {
  const t = await getScopedI18n("MarketingAbout")

  return (
    <MarketingTransition className="relative">
      <Particles
        className="pointer-events-none absolute inset-0 -z-10 animate-fade-in"
        quantity={200}
      />

      <section className="py-36">
        <div className="mx-auto max-w-7xl px-4">
          <header className="text-center">
            <span className="mx-auto uppercase tracking-widest text-muted-foreground">
              {t("our-mission")}
            </span>
            <h1 className="mx-auto mb-6 mt-2 w-fit max-w-4xl bg-gradient-to-r from-foreground to-primary bg-clip-text pb-4 text-5xl font-bold tracking-tighter text-transparent sm:text-7xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-xl text-balance text-lg sm:text-xl md:max-w-2xl">
              {t("title-desc")}
            </p>
          </header>

          <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2 md:mt-20 md:grid-cols-3 lg:mt-24 lg:gap-32">
            {iconsInfo.map((iconInfo, index) => (
              <div key={index} className="flex flex-row items-start gap-4">
                <div className="rounded-xl bg-muted p-2">
                  <iconInfo.IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-none sm:text-2xl">
                    {t(iconInfo.titleKey as never)}
                  </h2>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {t(iconInfo.descKey as never)}
                  </p>
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
              {t("team-title")}
            </h1>
            <p className="max-w-2xl text-muted-foreground">{t("team-desc")}</p>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="https://nabilfatih.com"
              target="_blank"
              className="rounded-xl border bg-card p-6 shadow transition-colors duration-300 ease-in-out hover:bg-muted/50"
            >
              <div className="flex items-start gap-6">
                <div className="relative h-12 w-12 rounded-full">
                  <Image
                    src="/nabil.webp"
                    fill
                    priority
                    alt="Nabil Fatih"
                    className="rounded-full bg-muted/90 object-cover object-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-medium">Nabil Fatih</h2>
                  <p className="text-muted-foreground">{t("ceo")}</p>
                </div>
              </div>
            </Link>
            <Link
              href="https://www.linkedin.com/in/anandalubis/"
              target="_blank"
              className="rounded-xl border bg-card p-6 shadow transition-colors duration-300 ease-in-out hover:bg-muted/50"
            >
              <div className="flex items-start gap-6">
                <div className="relative h-12 w-12 rounded-full">
                  <Image
                    src="/nanda.webp"
                    fill
                    priority
                    alt="Ananda Feby"
                    className="rounded-full bg-muted/90 object-cover object-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-medium">Ananda Feby</h2>
                  <p className="text-muted-foreground">
                    {t("public-relation")}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="https://www.linkedin.com/in/sesanti-nandi-pribadi/"
              target="_blank"
              className="rounded-xl border bg-card p-6 shadow transition-colors duration-300 ease-in-out hover:bg-muted/50"
            >
              <div className="flex items-start gap-6">
                <div className="relative h-12 w-12 rounded-full">
                  <Image
                    src="/nandi.webp"
                    fill
                    priority
                    alt="Sesanti Nandi"
                    className="rounded-full bg-muted/90 object-cover object-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-medium">Sesanti Nandi</h2>
                  <p className="text-muted-foreground">{t("copywriter")}</p>
                </div>
              </div>
            </Link>
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

      <MarketingCta />
    </MarketingTransition>
  )
}
