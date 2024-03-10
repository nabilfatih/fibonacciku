"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import supabaseAdmin from "@/lib/supabase/admin"
import {
  getUserDetailsAdmin,
  getUserSubscriptionAdmin
} from "@/lib/supabase/admin/users"
import { createClientServer } from "@/lib/supabase/server"

export async function getUser() {
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

  try {
    // Run both promises in parallel
    const [userDetails, subscription] = await Promise.all([
      getUserDetailsAdmin(user.id),
      getUserSubscriptionAdmin(user.id)
    ])

    return {
      userDetails,
      subscription
    }
  } catch (error) {
    return {
      error: "Something went wrong"
    }
  }
}

export async function updateUser(data: any) {
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

  const { error } = await supabase
    .from("users")
    .update({ ...data })
    .eq("id", user.id)

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
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "Unauthorized"
    }
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  revalidatePath("/")
  return revalidatePath("/account")
}
