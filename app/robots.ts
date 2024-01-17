import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/" // Allow everything
    },
    sitemap: "https://www.fibonacciku.com/sitemap.xml",
    host: "https://www.fibonacciku.com"
  }
}
