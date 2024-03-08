import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import type { Features } from "@/types/types"
import supabaseAdmin from "@/lib/supabase/admin"
import { getChatAdmin } from "@/lib/supabase/admin/chat"

import ChatMessage from "@/components/chat"

const getChat = cache(async (chatId: string) => {
  const chat = await getChatAdmin(chatId)
  // if there is chat return the title, if not return FibonacciKu
  return chat?.title ?? "FibonacciKu"
})

type Props = {
  params: { locale: string; feature: string; id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chatId = params.id
  const title = await getChat(chatId)
  return {
    title: title
  }
}

export default async function ChatMessagePage({ params }: Props) {
  setStaticParamsLocale(params.locale)
  // can be open without login
  const { data } = await supabaseAdmin
    .from("share_chat")
    .select("*, chat(*, users(*))")
    .eq("chat_id", params.id)
    .limit(1)
    .maybeSingle()

  if (!data) {
    notFound()
  }

  // this is because of typescript
  const chat = Array.isArray(data?.chat) ? data?.chat[0] : data?.chat

  if (!chat) {
    notFound()
  }

  return (
    <ChatMessage
      id={chat.id}
      initialMessages={chat.messages}
      type={chat.type as Features}
      title={chat.title}
      fileId={chat.file_id}
      chat={chat}
    />
  )
}
