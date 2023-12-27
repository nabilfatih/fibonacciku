import { generateUUID, getCurrentDate } from "@/utils/helpers";
import supabaseClient from ".";

export const insertShareChat = async (userId: string, chatId: string) => {
  const { data, error } = await supabaseClient
    .from("share_chat")
    .insert({
      id: generateUUID(),
      user_id: userId,
      chat_id: chatId,
      created_at: getCurrentDate(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteShareChatByChatId = async (chatId: string) => {
  const { error } = await supabaseClient
    .from("share_chat")
    .delete()
    .eq("chat_id", chatId);

  if (error) {
    throw error;
  }
};
