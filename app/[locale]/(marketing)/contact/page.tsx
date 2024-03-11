import type { Metadata } from "next"
import { setStaticParamsLocale } from "next-international/server"

import { getScopedI18n } from "@/locales/server"

import MarketingFormContact from "@/components/marketing/form-contact"
import MarketingTransition from "@/components/marketing/transition"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("MarketingContact")
  return {
    title: t("contact"),
    description: t("desc"),
    alternates: {
      languages: {
        en: "/en/contact",
        id: "/id/contact",
        de: "/de/contact",
        ru: "/ru/contact",
        nl: "/nl/contact",
        it: "/it/contact"
      }
    }
  }
}

export default async function ContactPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  const t = await getScopedI18n("MarketingContact")
  return (
    <MarketingTransition>
      <header className="bg-muted py-16">
        <div className="relative mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            {t("contact")}
          </h1>
          <p className="mt-6 max-w-3xl text-muted-foreground">{t("desc")}</p>
        </div>
      </header>

      <section className="py-24">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-12 md:flex-row md:gap-24">
            <div className="flex w-full flex-col gap-4 md:max-w-sm">
              <MarketingFormContact />
            </div>

            <div className="flex flex-col gap-4">
              {contactList.map(contact => (
                <div key={contact.query} className="flex flex-col">
                  <h2 className="text-sm font-medium tracking-tight text-muted-foreground">
                    {t(contact.query as never)}
                  </h2>
                  <p className="tracking-tight">{contact.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingTransition>
  )
}

const contactList = [
  {
    query: "get-help",
    email: "support@fibonacciku.com"
  },
  {
    query: "contact-sales",
    email: "sales@fibonacciku.com"
  },
  {
    query: "get-new-info",
    email: "info@fibonacciku.com"
  }
]
