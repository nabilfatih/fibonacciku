import Image from "next/image"
import Link from "next/link"
import { setStaticParamsLocale } from "next-international/server"

import { getScopedI18n } from "@/locales/server"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default async function ForgotPasswordPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  const t = await getScopedI18n("Auth")
  return (
    <>
      <Link href="/home" className="flex justify-center lg:hidden">
        <Image
          src="/logo-outline.webp"
          width={32}
          height={32}
          priority
          alt="FibonacciKu"
          className="rounded-full object-cover shadow"
        />
      </Link>
      <header className="flex flex-col space-y-2 pb-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("forgot-password")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("forgot-password-desc")}
        </p>
      </header>

      <ForgotPasswordForm />

      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>{t("login-desc")}</span>
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
          href="/terms-of-use"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("terms-of-service")}
        </Link>{" "}
        &{" "}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("privacy-policy")}
        </Link>
      </p>
    </>
  )
}
