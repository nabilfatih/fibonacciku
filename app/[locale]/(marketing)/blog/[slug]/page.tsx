import { cache } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  getBlogsBySlugAdmin,
  getBlogsCoverPublicUrlAdmin
} from "@/lib/supabase/admin/blogs"
import { getCurrentLocale, getScopedI18n } from "@/locales/server"

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
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
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
      <header className="py-32">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/blog" className="text-muted-foreground hover:underline">
            {t("blog")}
          </Link>
          <div className="mt-4 flex flex-wrap justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                {blog.title}
              </h1>
              <p className="text-lg">{blog.description}</p>
            </div>

            <Image
              src={cover}
              alt={blog.title}
              width={575}
              height={575}
              sizes="575px"
              className="m-0 rounded-sm border bg-muted/90 object-cover shadow-sm"
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl border-t px-4 pt-4">
        <div className="flex flex-wrap justify-between">
          <p className="tracking-tight">
            {new Date(blog.created_at).toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>

          <div className="flex flex-col">
            <p className="font-bold tracking-tight">{t("authors")}</p>
            <p className="tracking-tight">
              {blog.authors.split(",").map((author, index) => {
                return <span key={index}>{author}</span>
              })}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="font-bold tracking-tight">{t("tags")}</p>
            <p className="tracking-tight">
              {blog.tags.split(",").map((tag, index) => {
                return <span key={index}>{tag}</span>
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <article className="relative mx-auto max-w-3xl px-4">
          <ServerReactMarkdown content={blog.content} />
        </article>
      </section>
    </main>
  )
}
