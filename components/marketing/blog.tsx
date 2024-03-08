import Image from "next/image"
import Link from "next/link"

import {
  getBlogsAdmin,
  getBlogsCoverPublicUrlAdmin
} from "@/lib/supabase/admin/blogs"
import { getCurrentLocale, getScopedI18n } from "@/locales/server"

import { Badge } from "@/components/ui/badge"

type Props = {
  tag: string | undefined
  author: string | undefined
}

export default async function MarketingBlog({ tag, author }: Props) {
  const t = await getScopedI18n("Marketing")
  const locale = getCurrentLocale()
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

  return (
    <>
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
      {blogs.map(blog => {
        const cover = getBlogsCoverPublicUrlAdmin(blog.id, blog.cover)

        const tags = blog.tags.split(",").map(tag => tag.trim().toLowerCase())

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
    </>
  )
}
