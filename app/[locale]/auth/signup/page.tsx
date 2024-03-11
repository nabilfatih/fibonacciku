import type { Metadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import SignupAuthForm from "@/components/auth/signup-form"

type Props = {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Auth")

  return {
    title: t("sign-up"),
    alternates: {
      languages: {
        en: "/en/auth/signup",
        id: "/id/auth/signup",
        de: "/de/auth/signup",
        ru: "/ru/auth/signup",
        nl: "/nl/auth/signup",
        it: "/it/auth/signup"
      }
    }
  }
}

export default async function SignupPage({ params, searchParams }: Props) {
  setStaticParamsLocale(params.locale)
  const t = await getScopedI18n("Auth")

  // get next url, it is always a string
  const next = searchParams.next ? String(searchParams.next) : ""
  const referral = searchParams.ref ? String(searchParams.ref) : ""

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    redirect(next || "/chat/assistant")
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: t("login"),
                item: "https://fibonacciku.com/auth/login"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t("forgot-password"),
                item: "https://fibonacciku.com/auth/forgot-password"
              }
            ]
          })
        }}
      />
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
      <header className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("create-account")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("continue-with-google")}
        </p>
      </header>
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
