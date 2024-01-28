import { NextRequest } from "next/server"
import { createI18nMiddleware } from "next-international/middleware"

import { createClientMiddleware } from "@/lib/supabase/middleware"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "id", "de", "ru"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite"
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
