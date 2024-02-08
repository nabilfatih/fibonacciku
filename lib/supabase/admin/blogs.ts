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
    revalidate: 86400
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
    revalidate: 86400
  }
)
