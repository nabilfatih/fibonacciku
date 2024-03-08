import { cache } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import type { Features } from "@/types/types"
import { getChatAdmin } from "@/lib/supabase/admin/chat"
import { createClientServer } from "@/lib/supabase/server"

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
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=/chat/${params.feature}/${params.id}`)
  }

  const { data: chat } = await supabase
    .from("chat")
    .select()
    .eq("id", params.id)
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (!chat || chat.user_id !== user.id) {
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
