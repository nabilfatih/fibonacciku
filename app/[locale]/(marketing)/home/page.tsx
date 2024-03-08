import type { Metadata } from "next"
import { setStaticParamsLocale } from "next-international/server"

import MarketingHome from "@/components/marketing/home"

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/home",
      languages: {
        en: "/en/home",
        id: "/id/home",
        de: "/de/home",
        ru: "/ru/home",
        nl: "/nl/home",
        it: "/it/home"
      }
    }
  }
}

export default function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  return <MarketingHome />
}
