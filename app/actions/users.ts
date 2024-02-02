"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import supabaseAdmin from "@/lib/supabase/admin"
import { createClientServer } from "@/lib/supabase/server"

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

export async function deleteUser() {
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

  const { error } = await supabaseAdmin.auth.admin.deleteUser(session.user.id)

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  revalidatePath("/")
  return revalidatePath("/account")
}
