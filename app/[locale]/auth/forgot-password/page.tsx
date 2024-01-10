import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getScopedI18n } from "@/locales/server";
import Link from "next/link";

export default async function ForgotPasswordPage() {
  const t = await getScopedI18n("Auth");
  return (
    <>
      <header className="flex flex-col space-y-2 text-center">
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
