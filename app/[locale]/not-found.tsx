import { Button } from "@/components/ui/button"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"

export default async function NotFound() {
  const t = await getScopedI18n("BackendRouter")
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center space-y-4 px-4 text-center">
      <h2 className="text-4xl font-bold">404: {t("not-found")}</h2>
      <p>{t("resource-not-found")}</p>
      <Button asChild>
        <Link href="/">{t("return-home")}</Link>
      </Button>
    </div>
  )
}
