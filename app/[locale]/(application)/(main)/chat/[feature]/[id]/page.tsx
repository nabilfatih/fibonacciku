import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { kv } from "@vercel/kv"

import { createClientServer } from "@/lib/supabase/server"
import ChatMessage from "@/components/chat"
import type { Features } from "@/types/types"

export const runtime = "edge"

type Props = {
  params: { feature: string; id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chatId = params.id

  const title = await kv.get<string>(chatId).then(title => {
    if (title) {
      return title.toString().slice(0, 50)
    }
  })

  if (!title)
    return {
      title: {
        absolute: "FibonacciKu"
      }
    }

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
    notFound()
  }

  if (chat.user_id !== session.user.id) {
    notFound()
  }

  // expires in 24 hours
  await kv.set(chat.id, chat.title, {
    ex: 60 * 60 * 24,
    nx: true
  })

  return (
    <ChatMessage
      id={chat.id}
      userId={chat.user_id}
      initialMessages={chat.messages}
      type={chat.type as Features}
      title={chat.title}
      fileId={chat.file_id}
      createdAt={chat.created_at}
      chat={chat}
    />
  )
}
