import { setStaticParamsLocale } from "next-international/server"

import ChatExplore from "@/components/chat/explore"

export default function ChatExplorePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  return <ChatExplore />
}
