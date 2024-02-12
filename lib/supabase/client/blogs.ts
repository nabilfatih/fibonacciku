import type { Blogs } from "@/types/types"
import { getCurrentDate } from "@/lib/utils"

import supabaseClient from "."

export const uploadBlogsCoverFile = async (
  file: File,
  blogId: string,
  fileId: string
) => {
  const { data, error } = await supabaseClient.storage
    .from("blogs")
    .upload(`${blogId}/${fileId}`, file, {
      cacheControl: "3600",
      upsert: true
    })
  if (error) {
    throw error
  }
  return data
}

export const insertBlogs = async (blogs: Blogs) => {
  const { data, error } = await supabaseClient.from("blogs").insert(blogs)
  if (error) {
    throw error
  }
  return data
}

export const deleteBlogsCoverFile = async (blogId: string, fileId: string) => {
  const { error } = await supabaseClient.storage
    .from("blogs")
    .remove([`${blogId}/${fileId}`])
  if (error) {
    throw error
  }
}

export const deleteBlogs = async (blogId: string) => {
  const { error } = await supabaseClient.from("blogs").delete().eq("id", blogId)
  if (error) {
    throw error
  }
}

export const updateBlogsCover = async (blogId: string, fileId: string) => {
  const { error } = await supabaseClient
    .from("blogs")
    .update({ cover: fileId, updated_at: getCurrentDate() })
    .eq("id", blogId)

  if (error) {
    throw error
  }
}
