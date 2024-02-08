import { getBlogsAdmin } from "@/lib/supabase/admin/blogs"

export default async function BlogPage() {
  const blogs = await getBlogsAdmin()

  return <section></section>
}
