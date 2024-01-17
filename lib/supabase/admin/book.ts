import type { Books } from "@/types/types"
import { getCurrentDate } from "@/lib/utils"

import supabaseAdmin from "."

export const getBooksAllAdmin = async () => {
  const { data, error } = await supabaseAdmin
    .from("books_collection")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    throw error
  }
  return data
}

export const getBooksAdmin = async (bookId: string) => {
  const { data, error } = await supabaseAdmin
    .from("books_collection")
    .select("*")
    .eq("id", bookId)
    .maybeSingle()
  if (error) {
    throw error
  }
  return data as Books | null
}

export const getBooksProcessingAdmin = async () => {
  const { data, error } = await supabaseAdmin
    .from("books_collection")
    .select("*")
    .eq("status", "processing")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }
  return data
}

export const getBooksSignedUrlAdmin = async (
  bookId: string,
  fileId: string
) => {
  const { data, error } = await supabaseAdmin.storage
    .from("books")
    .createSignedUrl(`${bookId}/${fileId}`, 3600 * 24) // 1 day
  if (error) {
    throw error
  }
  return data.signedUrl
}

export const insertBooksAdmin = async (
  bookId: string,
  fileId: string,
  publicId: string,
  data: {
    title: string
    authors: string
    publisher: string
    isbn: string
    abstract: string
    publishedDate: string
    tags: string
    type: string
    lang: string
    collection: string
  }
) => {
  const { error } = await supabaseAdmin.from("books_collection").insert([
    {
      abstract: data.abstract,
      authors: data.authors,
      collection: data.collection,
      created_at: getCurrentDate(),
      file_id: fileId,
      id: bookId,
      isbn: data.isbn,
      public_id: publicId,
      published_date: data.publishedDate,
      publisher: data.publisher,
      status: "processing",
      tags: data.tags,
      title: data.title,
      type: data.type,
      lang: data.lang,
      updated_at: getCurrentDate()
    }
  ])
  if (error) {
    throw error
  }
}

export const updateBooksStatusAdmin = async (
  bookId: string,
  status: "processing" | "finished" | "invalid"
) => {
  const { data, error } = await supabaseAdmin
    .from("books_collection")
    .update({ status: status })
    .eq("id", bookId)
  if (error) {
    throw error
  }
  return data
}
