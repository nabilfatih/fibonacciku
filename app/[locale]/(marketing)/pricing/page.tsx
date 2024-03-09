import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

export default function PricingPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  redirect("/premium")
}
