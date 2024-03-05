"use server"

import { cookies } from "next/headers"

import { createClientServer } from "@/lib/supabase/server"

export async function getBookCollection(bookId: string) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "Unauthorized"
    }
  }

  const { data, error } = await supabase
    .from("books_collection")
    .select()
    .eq("id", bookId)
    .limit(1)
    .maybeSingle()

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

  return data
}
