import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { createClientServer } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const ref = searchParams.get("ref") ?? null
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/chat/assistant"

  if (code) {
    const cookieStore = cookies()
    const supabase = createClientServer(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log(error)
    if (!error) {
      if (ref) {
        return NextResponse.redirect(`${origin}${next}?ref=${ref}`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect("/auth/login")
}
