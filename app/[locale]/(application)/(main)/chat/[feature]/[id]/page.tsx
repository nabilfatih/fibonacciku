import { cache } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import type { Features } from "@/types/types"
import { getChatAdmin } from "@/lib/supabase/admin/chat"
import { createClientServer } from "@/lib/supabase/server"

import ChatMessage from "@/components/chat"

export const runtime = "edge"

const getChat = cache(async (chatId: string) => {
  const chat = await getChatAdmin(chatId)
  // if there is chat return the title, if not return FibonacciKu
  return chat?.title ?? "FibonacciKu"
})

type Props = {
  params: { feature: string; id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chatId = params.id
  const title = await getChat(chatId)
  return {
    title: title
  }
}

export default async function ChatMessagePage({ params }: Props) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect(`/auth/login?next=/chat/${params.feature}/${params.id}`)
  }

  const { data: chat } = await supabase
    .from("chat")
    .select()
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .limit(1)
    .maybeSingle()

  if (!chat) {
    redirect(`/chat/${params.feature}`)
  }

  if (chat.user_id !== session.user.id) {
    redirect(`/chat/${params.feature}`)
  }

  return (
    <ChatMessage
      id={chat.id}
      initialMessages={chat.messages}
      type={chat.type as Features}
      title={chat.title}
      fileId={chat.file_id}
      createdAt={chat.created_at}
      chat={chat}
    />
  )
}
