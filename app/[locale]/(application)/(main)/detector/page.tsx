import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

export default function DetectorPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  redirect("/detector/ai")
}
