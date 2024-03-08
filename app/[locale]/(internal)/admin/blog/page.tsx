import { setStaticParamsLocale } from "next-international/server"

import AdminInsertBlog from "@/components/admin/insert-blog"

export default function AdminBlogPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  return (
    <main>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl space-y-6 px-4">
          <h1 className="text-2xl font-bold">Insert Blog</h1>

          <AdminInsertBlog />
        </div>
      </div>
    </main>
  )
}
