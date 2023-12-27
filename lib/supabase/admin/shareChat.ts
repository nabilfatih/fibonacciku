import supabaseAdmin from ".";

export const getShareChatByChatIdAdmin = async (chatId: string) => {
  const { data, error } = await supabaseAdmin
    .from("share_chat")
    .select("*, chat(*, users(*))")
    .eq("chat_id", chatId)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
};
