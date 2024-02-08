import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBlogsBySlugAdmin } from "@/lib/supabase/admin/blogs"

const getBlog = cache(async (slug: string) => {
  const blog = await getBlogsBySlugAdmin(slug)
  // if there is chat return the title, if not return FibonacciKu
  return blog?.title ?? "FibonacciKu"
})

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug
  const title = await getBlog(slug)
  return {
    title: title
  }
}

export default function BlogSlugPage({ params }: Props) {
  const slug = params.slug

  const blog = getBlogsBySlugAdmin(slug)

  if (!blog) notFound()
}
