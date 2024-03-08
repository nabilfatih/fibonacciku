import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import { setStaticParamsLocale } from "next-international/server"

import { getScopedI18n } from "@/locales/server"

import ServerReactMarkdown from "@/components/markdown/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Marketing")
  return {
    title: t("terms-of-use")
  }
}

export default async function TermsOfUsePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  const t = await getScopedI18n("Marketing")
  const termsOfUseContent = fs.readFileSync(
    path.join(process.cwd(), "content/terms-of-use.mdx"),
    "utf8"
  )
  return (
    <main>
      <header className="bg-muted py-16 sm:py-24">
        <h1 className="relative mx-auto w-fit px-4 text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
          {t("terms-of-use")}
        </h1>
      </header>
      <section className="py-10">
        <article className="relative mx-auto max-w-3xl px-4">
          <ServerReactMarkdown content={termsOfUseContent} />
        </article>
      </section>
    </main>
  )
}
