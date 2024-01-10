import { getScopedI18n } from "@/locales/server";

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
    </>
  );
}
