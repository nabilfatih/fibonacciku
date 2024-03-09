import { cache } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { setStaticParamsLocale } from "next-international/server"

import {
  getBlogsAdmin,
  getBlogsCoverPublicUrlAdmin
} from "@/lib/supabase/admin/blogs"
import { getCurrentLocale, getScopedI18n } from "@/locales/server"

import { Badge } from "@/components/ui/badge"
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
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ params, searchParams }: Props) {
  setStaticParamsLocale(params.locale)
  const t = await getScopedI18n("Marketing")
  const locale = getCurrentLocale()
  const blogs = await getBlogs({ searchParams })

  return (
    <MarketingTransition>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: blogs.map((blog, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: blog.title,
              item: `https://fibonacciku.com/blog/${blog.slug}`
            }))
          })
        }}
      />
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
              {blogs.map(blog => {
                const cover = getBlogsCoverPublicUrlAdmin(blog.id, blog.cover)

                const tags = blog.tags
                  .split(",")
                  .map(tag => tag.trim().toLowerCase())

                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group relative mt-12"
                  >
                    <Image
                      src={cover}
                      alt={blog.title}
                      width={512}
                      height={512}
                      sizes="512px"
                      priority
                      className="m-0 rounded-xs border bg-muted/90 object-cover shadow transition-all duration-300 group-hover:rounded-5xl"
                    />
                    <div className="relative mt-2 grid gap-1.5 break-words">
                      <h3
                        title={blog.title}
                        className="line-clamp-2 text-lg font-semibold leading-tight tracking-tight"
                      >
                        {blog.title}
                      </h3>
                      <p className="line-clamp-1 text-sm leading-none tracking-tight">
                        {new Date(blog.created_at).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {t(tag as never)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <MarketingCta />
    </MarketingTransition>
  )
}

const getBlogs = cache(async ({ searchParams }: Omit<Props, "params">) => {
  const tag = searchParams.tag as string | undefined
  const author = searchParams.author as string | undefined

  const blogs = (await getBlogsAdmin()).filter(blog => {
    // it can be there is both tag and author
    if (tag && author) {
      return (
        blog.tags.toLowerCase().includes(tag.toLowerCase()) &&
        blog.authors.toLowerCase().includes(author.toLowerCase())
      )
    }
    if (tag) {
      return blog.tags.toLowerCase().includes(tag.toLowerCase())
    }
    if (author) {
      return blog.authors.toLowerCase().includes(author.toLowerCase())
    }
    return true
  })

  return blogs
})
