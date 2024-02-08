import { unstable_cache as cache } from "next/cache"

import supabaseAdmin from "."

export const getBlogsBySlugAdmin = cache(
  async (slug: string) => {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data
  },
  ["getBlogsBySlugAdmin"],
  {
    revalidate: 3600
  }
)

export const getBlogsAdmin = cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data
  },
  ["getBlogsAdmin"],
  {
    revalidate: 3600
  }
)

export const getBlogsCoverPublicUrlAdmin = (blogId: string, fileId: string) => {
  const { data } = supabaseAdmin.storage
    .from("blogs")
    .getPublicUrl(`${blogId}/${fileId}`)

  return data.publicUrl
}
