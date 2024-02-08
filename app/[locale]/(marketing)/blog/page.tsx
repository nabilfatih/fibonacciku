import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import {
  getBlogsAdmin,
  getBlogsCoverPublicUrlAdmin
} from "@/lib/supabase/admin/blogs"
import { getCurrentLocale, getScopedI18n } from "@/locales/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Marketing")
  return {
    title: t("blog")
  }
}

export default async function BlogPage() {
  const t = await getScopedI18n("Marketing")
  const locale = getCurrentLocale()
  const blogs = await getBlogsAdmin()

  return (
    <main>
      <header className="bg-muted py-16 sm:py-24">
        <h1 className="relative mx-auto w-fit px-4 text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
          {t("blog")}
        </h1>
      </header>
      <section className="py-10">
        <div className="relative mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-medium tracking-tight">
            {t("latest-updates")}
          </h2>

          <div className="py-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blogs.map(blog => {
                const cover = getBlogsCoverPublicUrlAdmin(blog.id, blog.cover)

                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group relative"
                  >
                    <Image
                      src={cover}
                      alt={blog.title}
                      width={512}
                      height={512}
                      sizes="100%"
                      className="m-0 rounded-sm border bg-muted/90 object-cover shadow-sm"
                    />
                    <div className="relative mt-2 grid gap-0.5 break-words">
                      <h3
                        title={blog.title}
                        className="line-clamp-2 font-semibold leading-tight group-hover:underline"
                      >
                        {blog.title}
                      </h3>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
