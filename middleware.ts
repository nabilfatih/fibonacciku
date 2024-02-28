import { NextRequest } from "next/server"
import { createI18nMiddleware } from "next-international/middleware"

import { createClientMiddleware } from "@/lib/supabase/middleware"

export const localesList = ["en", "id", "de", "ru", "nl", "it"]

const I18nMiddleware = createI18nMiddleware({
  locales: localesList,
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
  resolveLocaleFromRequest: request => {
    // request is a NextRequest
    const acceptLanguage = request.headers.get("accept-language")
    if (acceptLanguage) {
      const [locale] = acceptLanguage.split(",")
      // check if locale is supported
      if (localesList.includes(locale)) {
        return locale
      }
    }
    return "en"
  }
})

export async function middleware(req: NextRequest) {
  const res = I18nMiddleware(req)
  const { supabase, response } = createClientMiddleware(req, res)
  await supabase.auth.getSession()
  return response
}

export const config = {
  matcher: [
    "/((?!api|static|data|css|scripts|.*\\..*|_next|robots.txt|sitemap.xml|favicon.ico|manifest.json|manifest.webmanifest).*)"
  ]
}
