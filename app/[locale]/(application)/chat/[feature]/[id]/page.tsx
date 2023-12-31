import ChatMessage from "@/components/chat";
import { createClientServer } from "@/lib/supabase/server";
import { kv } from "@vercel/kv";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const runtime = "edge";

type Props = {
  params: { feature: string; id: string };
};

async function fetchChatTitle(chatId: string) {
  const title = await kv
    .get<string>(chatId)
    .then(title => title?.toString().slice(0, 50));

  return title ?? "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chatId = params.id;

  const title = await fetchChatTitle(chatId);

  if (!title)
    return {
      title: {
        absolute: "FibonacciKu",
      },
    };

  return {
    title: title,
  };
}

export default async function ChatMessagePage({ params }: Props) {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect(`/auth/login?next=/chat/${params.feature}/${params.id}`);
  }

  const { data: chat } = await supabase
    .from("chat")
    .select()
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .limit(1)
    .maybeSingle();

  if (!chat) {
    notFound();
  }

  if (chat.user_id !== session.user.id) {
    notFound();
  }

  // expires in 12 hours
  await kv.set(chat.id, chat.title, {
    ex: 60 * 60 * 12,
    nx: true,
  });

  return (
    <ChatMessage
      id={chat.id}
      userId={chat.user_id}
      initialMessages={chat.messages}
      type={chat.type as "assistant" | "document"}
      title={chat.title}
      fileId={chat.file_id}
      createdAt={chat.created_at}
    />
  );
}
