import { Suspense } from "react"
import type { Metadata } from "next"

import { getScopedI18n } from "@/locales/server"

import { Skeleton } from "@/components/ui/skeleton"
import MarketingBlog from "@/components/marketing/blog"
import MarketingCta from "@/components/marketing/cta"
import MarketingTransition from "@/components/marketing/transition"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Marketing")
  return {
    title: t("blog"),
    description: t("blog-desc"),
    alternates: {
      canonical: "/blog",
      languages: {
        en: "/en/blog",
        id: "/id/blog",
        de: "/de/blog",
        ru: "/ru/blog",
        nl: "/nl/blog",
        it: "/it/blog"
      }
    }
  }
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ searchParams }: Props) {
  const tag = searchParams.tag as string | undefined
  const author = searchParams.author as string | undefined

  const t = await getScopedI18n("Marketing")

  return (
    <MarketingTransition>
      <header className="bg-muted py-16">
        <div className="relative mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            {t("blog")}
          </h1>
          <p className="mt-6 max-w-3xl text-muted-foreground">
            {t("blog-desc")}
          </p>
        </div>
      </header>

      <section className="py-24">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-medium tracking-tighter">
              {t("latest-updates")}
            </h2>
          </div>

          <div className="pb-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Suspense
                fallback={Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="group relative mt-12">
                    <Skeleton className="h-[311px] w-full rounded-xs" />
                    <div className="relative mt-2 grid gap-1.5 break-words">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-2/4" />
                    </div>
                  </div>
                ))}
              >
                <MarketingBlog tag={tag} author={author} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <MarketingCta />
    </MarketingTransition>
  )
}
