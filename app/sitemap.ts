import type { MetadataRoute } from "next"

const locales = ["", "/en", "/id", "/de", "/ru"]

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
  "/school",
  "/share",
  "/account"
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fibonacciku.com"

  const paths = locales.flatMap(locale => {
    return pathnames.map(pathname => {
      return {
        url: `${baseUrl}${locale}${pathname}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: "weekly",
        priority: 0.8
      } satisfies MetadataRoute.Sitemap[0]
    })
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 1
    },
    ...paths
  ]
}
