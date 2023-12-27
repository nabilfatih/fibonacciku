import { LoginAuthForm } from "@/components/auth/login-form";
import { createClientServer } from "@/lib/supabase/server";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Auth");

  return {
    title: t("login"),
    alternates: {
      canonical: "/auth/login",
      languages: {
        en: "/en/auth/login",
        id: "/id/auth/login",
        de: "/de/auth/login",
      },
    },
  };
}

export default async function LoginPage({ searchParams }: Props) {
  const t = await getScopedI18n("Auth");

  // get next url, it is always a string
  const next = searchParams.next ? String(searchParams.next) : "";

  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect(next || "/chat/assistant");
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("welcome")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("login-header")}</p>
      </div>
      <LoginAuthForm />
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
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("terms-of-service")}
        </Link>{" "}
        &{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("privacy-policy")}
        </Link>
      </p>
    </>
  );
}
