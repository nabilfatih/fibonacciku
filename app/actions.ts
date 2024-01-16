"use server"

import { createClientServer } from "@/lib/supabase/server"
import { generateUUID, getCurrentDate } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function renameChat(id: string, title: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  const { data, error } = await supabase
    .from("chat")
    .update({ title, updated_at: getCurrentDate() })
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  if (!data || data.user_id !== session.user.id) {
    return {
      error: "Unauthorized"
    }
  }
}

export async function removeChat(id: string, path: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  const { data, error } = await supabase
    .from("chat")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  if (!data || data.user_id !== session.user.id) {
    return {
      error: "Unauthorized"
    }
  }

  revalidatePath("/")
  return revalidatePath(path)
}

export async function shareChat(id: string, type: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  // check if already shared
  const { data: sharedData } = await supabase
    .from("share_chat")
    .select()
    .eq("chat_id", id)
    .limit(1)
    .maybeSingle()

  if (sharedData) {
    // return sharedData
    const payload = {
      ...sharedData,
      sharePath: `/share/${type}/${sharedData.chat_id}`
    }
    return payload
  }

  const { data, error } = await supabase
    .from("share_chat")
    .insert({
      id: generateUUID(),
      user_id: session.user.id,
      chat_id: id,
      created_at: getCurrentDate()
    })
    .select()
    .maybeSingle()

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  if (!data || data.user_id !== session.user.id) {
    return {
      error: "Something went wrong"
    }
  }

  const payload = {
    ...data,
    sharePath: `/share/${type}/${data.chat_id}`
  }

  return payload
}

// TODO: Refactor this library actions

export async function getLibraryFile(fileId: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(`${session.user.id}/${fileId}`, 60 * 60 * 24)

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  if (!data) {
    return {
      error: "Unauthorized"
    }
  }

  return {
    data: data.signedUrl
  }
}

export async function renameLibrary(id: string, title: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  const { data, error } = await supabase
    .from("libraries")
    .update({
      name: title,
      updated_at: getCurrentDate()
    })
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  if (!data || data.user_id !== session.user.id) {
    return {
      error: "Unauthorized"
    }
  }

  revalidatePath("/")
  return revalidatePath("/chat/library")
}

export async function removeLibrary(id: string, fileId: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  async function deleteLibrary() {
    await supabase.from("libraries").delete().eq("id", id)
  }
  async function deleteChatDocument() {
    await supabase.storage
      .from("documents")
      .remove([`${session?.user.id}/${fileId}`])
  }
  async function deleteDocument() {
    await supabase
      .from("documents")
      .delete()
      .contains("metadata", { file_id: fileId, user_id: session?.user.id })
  }
  async function deleteChatByFileId() {
    await supabase.from("chat").delete().eq("file_id", fileId)
  }

  await Promise.all([
    deleteLibrary(),
    deleteChatDocument(),
    deleteDocument(),
    deleteChatByFileId()
  ]).catch(error => {
    return {
      error: "Something went wrong"
    }
  })

  revalidatePath("/")
  return revalidatePath("/chat/library")
}

// TODO: Refactor this user actions

export async function updateUser(id: string, data: any) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return {
      error: "Unauthorized"
    }
  }

  const { error } = await supabase
    .from("users")
    .update({ ...data })
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  revalidatePath("/")
  return revalidatePath("/account")
}
