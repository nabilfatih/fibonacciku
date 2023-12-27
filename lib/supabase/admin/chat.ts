import type { ChatMessage } from "@/types/types";
import supabaseAdmin from ".";
import { generateNanoID } from "@/lib/utils";
import { decode } from "base64-arraybuffer";

export const getChatAdmin = async (chatId: string) => {
  const { data, error } = await supabaseAdmin
    .from("chat")
    .select()
    .eq("id", chatId);

  if (error) {
    throw error;
  }

  return data[0] || null;
};

export const getChatAllWithFileAdmin = async () => {
  // get chat only if file_id is not null
  const { data, error } = await supabaseAdmin
    .from("chat")
    .select("*")
    .not("file_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getUserChatAdmin = async (chatId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("chat")
    .select()
    .eq("id", chatId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
};

export const getChatTitleAdmin = async (chatId: string) => {
  const { data, error } = await supabaseAdmin
    .from("chat")
    .select("title")
    .eq("id", chatId)
    .single();

  if (error) {
    throw error;
  }

  return data ? data.title : null;
};

export const deleteChatAdmin = async (chatId: string) => {
  const { error } = await supabaseAdmin.from("chat").delete().eq("id", chatId);
  if (error) {
    throw error;
  }
};

export const getChatMessagesAdmin = async (chatId: string) => {
  const { data, error } = await supabaseAdmin
    .from("chat")
    .select("messages")
    .eq("id", chatId)
    .single();
  if (error) {
    throw error;
  }
  if (data) return data.messages;
};

export const insertChatAdmin = async (
  chatId: string,
  userId: string,
  title: string,
  optionsData: { language: string; grade: string }
) => {
  const { error } = await supabaseAdmin.from("chat").insert({
    id: chatId,
    user_id: userId,
    title: title,
    messages: [],
    grade: optionsData.grade.toLowerCase(),
    language: optionsData.language.toLowerCase(),
  });

  if (error) {
    throw error;
  }
};

export const updateChatMessageAdmin = async (
  chatId: string,
  messages: ChatMessage[]
) => {
  const { data, error } = await supabaseAdmin
    .from("chat")
    .update({ messages: messages })
    .eq("id", chatId);

  if (error) {
    throw error;
  }

  return data;
};

export const uploadChatDocumentAdmin = async (
  file: File | Blob,
  userId: string,
  fileId: string
) => {
  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .upload(`${userId}/${fileId}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    throw error;
  }
  return data;
};

export const getUserChatDocumentAdmin = async (userId: string) => {
  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .list(userId);
  if (error) {
    throw error;
  }
  return data;
};

export const downloadChatDocumentAdmin = async (
  userId: string,
  fileId: string
) => {
  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .download(`${userId}/${fileId}`);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export const getChatDocumentSignedUrlAdmin = async (
  userId: string,
  fileId: string
) => {
  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(`${userId}/${fileId}`, 3600);
  if (error) {
    throw error;
  }
  return data.signedUrl;
};

export const deleteChatDocumentAdmin = async (
  userId: string,
  fileId: string
) => {
  const { error } = await supabaseAdmin.storage
    .from("documents")
    .remove([`${userId}/${fileId}`]);
  if (error) {
    throw error;
  }
};

export const deleteDocumentAdmin = async (userId: string, fileId: string) => {
  const { error } = await supabaseAdmin
    .from("documents")
    .delete()
    .contains("metadata", { file_id: fileId, user_id: userId });
  if (error) {
    throw error;
  }
};

export const getChatAttachmentPublicUrlAdmin = async (
  userId: string,
  chatId: string,
  fileId: string
) => {
  const { data } = supabaseAdmin.storage
    .from("attachments")
    .getPublicUrl(`${userId}/${chatId}/${fileId}`);
  return data.publicUrl;
};

export const getChatAttachmentSignedUrlAdmin = async (
  userId: string,
  chatId: string,
  fileId: string
) => {
  const { data, error } = await supabaseAdmin.storage
    .from("attachments")
    .createSignedUrl(`${userId}/${chatId}/${fileId}`, 60);
  if (error) {
    throw error;
  }
  return data.signedUrl;
};

export const uploadChatImageAdmin = async (
  userId: string,
  chatId: string,
  base64: string
) => {
  // generate fileId first
  const fileId = generateNanoID();
  const { data, error } = await supabaseAdmin.storage
    .from("images")
    .upload(`${userId}/${chatId}/${fileId}`, decode(base64), {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    throw error;
  }
  return { fileId, data };
};

export const getChatImagePublicUrlAdmin = async (
  userId: string,
  chatId: string,
  fileId: string
) => {
  const { data } = supabaseAdmin.storage
    .from("images")
    .getPublicUrl(`${userId}/${chatId}/${fileId}`);
  return data.publicUrl;
};
