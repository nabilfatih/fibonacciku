import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import { SignupAuthForm } from "@/components/auth/signup-form"

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Auth")

  return {
    title: t("sign-up"),
    alternates: {
      canonical: "/auth/signup",
      languages: {
        en: "/en/auth/signup",
        id: "/id/auth/signup",
        de: "/de/auth/signup",
        ru: "/ru/auth/signup"
      }
    }
  }
}

export default async function SignupPage({ searchParams }: Props) {
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
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("create-account")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("continue-with-google")}
        </p>
      </div>
      <SignupAuthForm next={next} referral={referral} />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>{t("login-desc")}</span>
        {` `}
        <Link
          href={
            next
              ? `/auth/login?next=${encodeURIComponent(next)}`
              : "/auth/login"
          }
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("login")}
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
