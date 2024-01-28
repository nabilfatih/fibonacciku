import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import { LoginAuthForm } from "@/components/auth/login-form"

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Auth")

  return {
    title: t("login"),
    alternates: {
      canonical: "/auth/login",
      languages: {
        en: "/en/auth/login",
        id: "/id/auth/login",
        de: "/de/auth/login",
        ru: "/ru/auth/login"
      }
    }
  }
}

export default async function LoginPage({ searchParams }: Props) {
  const t = await getScopedI18n("Auth")

  // get next url, it is always a string
  const next = searchParams.next ? String(searchParams.next) : ""
  const referral = searchParams.ref ? String(searchParams.ref) : ""

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    redirect(next || "/chat/assistant")
  }

  return (
    <>
      <header className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("welcome")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("login-header")}</p>
      </header>
      <LoginAuthForm next={next} referral={referral} />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/auth/forgot-password" className="hover:text-primary">
          {t("forgot-password")}
        </Link>
      </p>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>{t("sign-up-desc")}</span>
        {` `}
        <Link
          href={
            next
              ? `/auth/signup?next=${encodeURIComponent(next)}`
              : "/auth/signup"
          }
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("sign-up")}
        </Link>
      </p>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/terms"
          target="_blank"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("terms-of-service")}
        </Link>{" "}
        &{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("privacy-policy")}
        </Link>
      </p>
    </>
  )
}
