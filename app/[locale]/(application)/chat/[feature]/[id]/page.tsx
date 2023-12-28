import ChatMessage from "@/components/chat";
import { createClientServer } from "@/lib/supabase/server";
import type { Chat } from "@/types/types";
import { kv } from "@vercel/kv";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const runtime = "edge";

type Props = {
  params: { feature: string; id: string };
};

async function fetchUserChat(chatId: string, userId: string) {
  try {
    const response = await fetch(
      `https://www.fibonacciku.com/api/app/get-chat/${chatId}/${userId}`,
      {
        cache: "no-store", // no catch so we can get the latest chat
      }
    );
    const data = await response.json();
    return data.chat as Chat | null;
  } catch (error) {
    return null;
  }
}

async function fetchChatTitle(chatId: string) {
  const title = await kv
    .get<string>(chatId)
    .then((title) => title?.toString().slice(0, 50));

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
    redirect(`/login?next=/chat/${params.feature}/${params.id}`);
  }

  const chat = await fetchUserChat(params.id, session.user.id);

  if (!chat) {
    notFound();
  }

  if (chat?.user_id !== session?.user?.id) {
    notFound();
  }

  return <ChatMessage id={chat.id} initialMessages={chat.messages} />;
}
