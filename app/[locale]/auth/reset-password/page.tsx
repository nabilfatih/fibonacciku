import type { Metadata } from "next"
import Link from "next/link"

import { getScopedI18n } from "@/locales/server"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Auth")

  return {
    title: t("reset-password"),
    alternates: {
      canonical: "/auth/reset-password",
      languages: {
        en: "/en/auth/reset-password",
        id: "/id/auth/reset-password",
        de: "/de/auth/reset-password"
      }
    }
  }
}

export default async function ResetPasswordPage() {
  const t = await getScopedI18n("Auth")

  return (
    <>
      <header className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("reset-password")}
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </header>

      <ResetPasswordForm />

      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>{t("back-to-login")}</span>
        {` `}
        <Link
          href="/auth/login"
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
