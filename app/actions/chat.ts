"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import type { Features } from "@/types/types"
import { createClientServer } from "@/lib/supabase/server"
import { generateUUID, getCurrentDate } from "@/lib/utils"

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

export async function getChatFile(fileId: string, type: Features) {
  const validFeatures = new Set(["document", "book"])
  if (!validFeatures.has(type)) {
    return {
      data: null
    }
  }

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

  let file: string | null = null

  if (type === "document") {
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

    file = data.signedUrl
  }

  if (type === "book") {
    const [bookId, bookFileId] = fileId.split("--") // bookId--bookFileId -> this is keyId
    const { data, error } = await supabase.storage
      .from("books")
      .createSignedUrl(`${bookId}/${bookFileId}`, 60 * 60 * 24)

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

    file = data.signedUrl
  }

  return {
    data: file
  }
}
