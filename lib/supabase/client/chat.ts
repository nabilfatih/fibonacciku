import type { ChatMessage, RoleAgent, SaveDataMessage } from "@/types/types";
import supabaseClient from ".";
import { generateNanoID, generateUUID, getCurrentDate } from "@/lib/utils";

export const getChat = async (chatId: string) => {
  const { data, error } = await supabaseClient
    .from("chat")
    .select()
    .eq("id", chatId);

  if (error) {
    throw error;
  }

  return data[0] || null;
};

export const getUserChat = async (chatId: string, userId: string) => {
  const { data, error } = await supabaseClient
    .from("chat")
    .select()
    .eq("id", chatId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data[0] || null;
};

export const deleteChat = async (chatId: string) => {
  const { error } = await supabaseClient.from("chat").delete().eq("id", chatId);

  if (error) {
    throw error;
  }
};

export const deleteChatByFileId = async (fileId: string) => {
  const { error } = await supabaseClient
    .from("chat")
    .delete()
    .eq("file_id", fileId);

  if (error) {
    throw error;
  }
};

export const updateChatTitle = async (chatId: string, title: string) => {
  const { error } = await supabaseClient
    .from("chat")
    .update({ title, updated_at: getCurrentDate() })
    .eq("id", chatId);

  if (error) {
    throw error;
  }
};

export const updateChatLanguageAndGrade = async (
  chatId: string,
  options: {
    language: string;
    grade: string;
  }
) => {
  const { error } = await supabaseClient
    .from("chat")
    .update({
      language: options.language,
      grade: options.grade,
      updated_at: getCurrentDate(),
    })
    .eq("id", chatId);
  if (error) {
    throw error;
  }
};

export const updateChatLanguage = async (chatId: string, language: string) => {
  const { error } = await supabaseClient
    .from("chat")
    .update({
      language: language,
      updated_at: getCurrentDate(),
    })
    .eq("id", chatId);
  if (error) {
    throw error;
  }
};

export const updateChatGrade = async (chatId: string, grade: string) => {
  const { error } = await supabaseClient
    .from("chat")
    .update({
      grade: grade,
      updated_at: getCurrentDate(),
    })
    .eq("id", chatId);
  if (error) {
    throw error;
  }
};

export const getChatMessages = async (chatId: string) => {
  const { data, error } = await supabaseClient
    .from("chat")
    .select("messages")
    .eq("id", chatId)
    .single();
  if (error) {
    throw error;
  }
  if (data) return data.messages;
  return [];
};

export const insertChat = async (
  chatId: string,
  userId: string,
  title: string
) => {
  const { data, error } = await supabaseClient
    .from("chat")
    .insert({ id: chatId, user_id: userId, title: title, messages: [] }) // initial messages
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateChatMessage = async (
  chatId: string,
  message: SaveDataMessage[]
) => {
  const { data, error } = await supabaseClient
    .from("chat")
    .update({ messages: message, updated_at: getCurrentDate() })
    .eq("id", chatId);

  if (error) {
    throw error;
  }

  return data;
};

export const updateChatMessageContentSpecificIndex = async (
  chatId: string,
  messageIndex: number,
  contentIndex: number,
  content: string,
  options: {
    language: string;
    grade: string;
  }
) => {
  const chatMessage = await getChatMessages(chatId);

  chatMessage[messageIndex].content[contentIndex] = content;
  const { error } = await supabaseClient
    .from("chat")
    .update({
      messages: chatMessage,
      language: options.language,
      grade: options.grade,
      updated_at: getCurrentDate(),
    })
    .eq("id", chatId);
  if (error) {
    throw error;
  }
};

export const insertChatDocument = async (
  userId: string,
  fileId: string,
  title: string,
  message: SaveDataMessage[]
) => {
  const userMessage = message.map((m, index) => {
    return {
      id: generateUUID(),
      role: m.role as RoleAgent,
      content: [String(m.content)],
      metadata: m.metadata,
      created_at: getCurrentDate(),
    };
  });
  const { data, error } = await supabaseClient
    .from("chat")
    .insert({
      id: generateUUID(),
      user_id: userId,
      title: title,
      messages: userMessage,
      type: "document",
      file_id: fileId,
      filename: title,
    })
    .select();
  if (error) throw error;
  if (data) return data[0];
};

export const uploadChatDocument = async (
  file: File | Blob,
  userId: string,
  fileId: string
) => {
  const { data, error } = await supabaseClient.storage
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

export const getUserChatDocument = async (userId: string) => {
  const { data, error } = await supabaseClient.storage
    .from("documents")
    .list(userId);
  if (error) {
    throw error;
  }
  return data;
};

export const getChatDocumentSignedUrl = async (
  userId: string,
  fileId: string
) => {
  const { data, error } = await supabaseClient.storage
    .from("documents")
    .createSignedUrl(`${userId}/${fileId}`, 60 * 60 * 24);
  if (error) {
    throw error;
  }
  return data.signedUrl;
};

export const downloadChatDocument = async (userId: string, fileId: string) => {
  const { data, error } = await supabaseClient.storage
    .from("documents")
    .download(`${userId}/${fileId}`);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export const deleteChatDocument = async (userId: string, fileId: string) => {
  const { error } = await supabaseClient.storage
    .from("documents")
    .remove([`${userId}/${fileId}`]);
  if (error) {
    throw error;
  }
};

export const deleteDocument = async (userId: string, fileId: string) => {
  const { error } = await supabaseClient
    .from("documents")
    .delete()
    .contains("metadata", { file_id: fileId, user_id: userId });
  if (error) {
    throw error;
  }
};

export const getChatAttachmentPublicUrl = (
  userId: string,
  chatId: string,
  fileId: string
) => {
  const { data } = supabaseClient.storage
    .from("attachments")
    .getPublicUrl(`${userId}/${chatId}/${fileId}`);
  return data.publicUrl;
};

export const uploadChatAttachment = async (
  file: File | Blob,
  userId: string,
  chatId: string
) => {
  // generate fileId first
  const fileId = generateNanoID();
  const { data, error } = await supabaseClient.storage
    .from("attachments")
    .upload(`${userId}/${chatId}/${fileId}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    throw error;
  }

  return fileId;
};

export const getChatAttachmentSignedUrl = async (
  userId: string,
  chatId: string,
  fileId: string
) => {
  const { data, error } = await supabaseClient.storage
    .from("attachments")
    .createSignedUrl(`${userId}/${chatId}/${fileId}`, 60 * 60 * 24);
  if (error) {
    throw error;
  }
  return data.signedUrl;
};
