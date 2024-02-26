import type { MetadataRoute } from "next"

import { getBlogsSlugAdmin } from "@/lib/supabase/admin/blogs"

const locales = ["", "/en", "/id", "/de", "/ru", "nl"]

const pathnames = [
  "/",
  "/home",
  "/about",
  "/contact",
  "/pricing",
  "/premium",
  "/partner",
  "/product",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/chat",
  "/chat/assistant",
  "/chat/document",
  "/chat/library",
  "/chat/book",
  "/book",
  "/book/collection",
  "/school",
  "/share",
  "/account",
  "/terms-of-use",
  "/privacy-policy",
  "/blog"
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.fibonacciku.com"

  const blogSlugs = await getBlogsSlugAdmin()

  const blogsPaths: MetadataRoute.Sitemap = locales.flatMap(locale => {
    return blogSlugs.map(blog => {
      return {
        url: `${baseUrl}${locale}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at).toISOString().split("T")[0],
        changeFrequency: "weekly",
        priority: 1
      }
    })
  })

  const paths: MetadataRoute.Sitemap = locales.flatMap(locale => {
    return pathnames.map(pathname => {
      return {
        url: `${baseUrl}${locale}${pathname}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: "weekly",
        priority: 1
      }
    })
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 1
    },
    ...paths,
    ...blogsPaths
  ]
}
