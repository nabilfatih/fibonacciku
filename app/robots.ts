import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*"
      }
    ],
    sitemap: "https://fibonacciku.com/sitemap.xml",
    host: "https://fibonacciku.com"
  }
}
