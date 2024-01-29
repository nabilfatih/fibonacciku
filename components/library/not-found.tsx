import { useScopedI18n } from "@/locales/client"

export default function LibraryNotFound() {
  const t = useScopedI18n("Library")

  return (
    <div className="p-8 text-center">
      <p className="text-sm text-muted-foreground">{t("document-not-found")}</p>
    </div>
  )
}
