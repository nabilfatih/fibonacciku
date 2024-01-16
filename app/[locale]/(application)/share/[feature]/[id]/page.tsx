import ChatMessage from "@/components/chat"
import supabaseAdmin from "@/lib/supabase/admin"
import { kv } from "@vercel/kv"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

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
  // can be open without login
  const { data } = await supabaseAdmin
    .from("share_chat")
    .select("*, chat(*, users(*))")
    .eq("chat_id", params.id)
    .limit(1)
    .maybeSingle()

  // this is because of typescript
  const chat = Array.isArray(data?.chat) ? data?.chat[0] : data?.chat

  if (!chat) {
    notFound()
  }

  return (
    <ChatMessage
      id={chat.id}
      userId={chat.user_id}
      initialMessages={chat.messages}
      type={chat.type as "assistant" | "document"}
      title={chat.title}
      fileId={chat.file_id}
      createdAt={chat.created_at}
      chat={chat}
    />
  )
}
