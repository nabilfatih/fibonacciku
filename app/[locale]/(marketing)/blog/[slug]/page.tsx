import { cache } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IconChevronLeft } from "@tabler/icons-react"

import {
  getBlogsBySlugAdmin,
  getBlogsCoverPublicUrlAdmin
} from "@/lib/supabase/admin/blogs"
import { getCurrentLocale, getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import ServerReactMarkdown from "@/components/markdown/server"

const getBlog = cache(async (slug: string) => {
  const blog = await getBlogsBySlugAdmin(slug)
  // if there is chat return the title, if not return FibonacciKu
  return blog
})

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "FibonacciKu"
    }
  }

  const ogImage = {
    url: getBlogsCoverPublicUrlAdmin(blog.id, blog.cover),
    width: 575,
    height: 575,
    alt: blog.title
  }

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: `/blog/${blog.slug}`,
      languages: {
        en: `/en/blog/${blog.slug}`,
        id: `/id/blog/${blog.slug}`,
        de: `/de/blog/${blog.slug}`,
        ru: `/ru/blog/${blog.slug}`
      }
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      publishedTime: new Date(blog.created_at).toISOString(),
      authors: blog.authors.split(","),
      url: `https://fibonacciku.com/blog/${blog.slug}`,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [ogImage]
    }
  }
}

export default async function BlogSlugPage({ params }: Props) {
  const slug = params.slug
  const t = await getScopedI18n("Marketing")
  const locale = getCurrentLocale()
  const blog = await getBlogsBySlugAdmin(slug)

  if (!blog) notFound()

  const cover = getBlogsCoverPublicUrlAdmin(blog.id, blog.cover)

  return (
    <main>
      <header className="py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-4">
          <Link
            href="/blog"
            className="text-lg leading-none tracking-tight hover:underline"
          >
            {t("blog")}
          </Link>
          <div className="mt-4 grid grid-cols-1 justify-between gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h1 className="break-words text-5xl font-medium leading-none tracking-tighter lg:text-7xl">
                {blog.title}
              </h1>
              <p className="break-words text-xl leading-tight tracking-tighter lg:text-3xl">
                {blog.description}
              </p>
            </div>

            <Image
              src={cover}
              alt={blog.title}
              width={600}
              height={600}
              sizes="600px"
              priority
              className="m-0 rounded-sm border bg-muted/90 object-cover shadow"
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl border-t px-4 pt-4">
        <div className="flex flex-wrap justify-between gap-4">
          <p className="tracking-tight">
            {new Date(blog.created_at).toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>

          <div className="flex flex-col">
            <p className="font-bold tracking-tight">{t("authors")}</p>
            <p className="tracking-tight">{blog.authors}</p>
          </div>

          <div className="flex flex-col">
            <p className="font-bold tracking-tight">{t("tags")}</p>
            <p className="tracking-tight">{blog.tags}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <article className="relative mx-auto max-w-3xl px-4">
          <ServerReactMarkdown content={blog.content} />
        </article>
      </section>

      <section className="mx-auto max-w-7xl border-t px-4 py-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm italic">{t("text-footer")}</p>
          <Button asChild variant="link">
            <Link href="/blog">{t("see-all-blogs")}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
