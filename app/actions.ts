"use server";

import { createClientServer } from "@/lib/supabase/server";
import { generateUUID, getCurrentDate } from "@/lib/utils";
import { cookies } from "next/headers";

export async function shareChat(id: string, type: string) {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const { data, error } = await supabase
    .from("share_chat")
    .insert({
      id: generateUUID(),
      user_id: session.user.id,
      chat_id: id,
      created_at: getCurrentDate(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data || data.user_id !== session.user.id) {
    return {
      error: "Something went wrong",
    };
  }

  const payload = {
    ...data,
    sharePath: `/share/${type}/${data.chat_id}`,
  };

  return payload;
}
