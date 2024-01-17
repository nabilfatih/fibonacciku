import type { LibraryStatus } from "@/types/types"
import { getCurrentDate } from "@/lib/utils"

import supabaseAdmin from "."

export const getLibraryAll = async () => {
  const { data, error } = await supabaseAdmin
    .from("libraries")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    throw error
  }
  return data
}

export const getLibraryProcessingAdmin = async () => {
  const { data, error } = await supabaseAdmin
    .from("libraries")
    .select("*")
    .eq("status", "processing")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }
  return data
}

export const getLibraryByFileIdAdmin = async (fileId: string) => {
  const { data, error } = await supabaseAdmin
    .from("libraries")
    .select("*")
    .eq("file_id", fileId)
    .limit(1)
    .maybeSingle()
  if (error) {
    throw error
  }
  return data
}

export const insertLibraryAdmin = async (
  userId: string,
  fileId: string,
  libraryId: string,
  fileName: string,
  fileType: string,
  publicId: string | null
) => {
  const { error } = await supabaseAdmin.from("libraries").insert({
    id: libraryId,
    user_id: userId,
    file_id: fileId,
    status: "processing",
    public_id: publicId,
    name: fileName,
    file_type: fileType,
    created_at: getCurrentDate(),
    updated_at: getCurrentDate()
  })
  if (error) {
    throw error
  }
}

export const getUserLibraryAdmin = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("libraries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100)
  if (error) {
    throw error
  }
  return data
}

export const updateLibraryStatusAdmin = async (
  libraryId: string,
  status: LibraryStatus
) => {
  const { data, error } = await supabaseAdmin
    .from("libraries")
    .update({ status: status })
    .eq("id", libraryId)
  if (error) {
    throw error
  }
  return data
}
