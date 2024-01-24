"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { createClientServer } from "@/lib/supabase/server"
import { getCurrentDate } from "@/lib/utils"

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
