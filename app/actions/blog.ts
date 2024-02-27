import { revalidatePath } from "next/cache"

import supabaseAdmin from "@/lib/supabase/admin"

export async function updateBlogs(id: string, data: any) {
  const { error } = await supabaseAdmin
    .from("blogs")
    .update({ ...data })
    .eq("id", id)

  if (error) {
    return {
      error: "Something went wrong"
    }
  }

  revalidatePath("/blog")
}
