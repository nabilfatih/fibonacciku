import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

export default function ChatPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  redirect("/chat/assistant")
}
