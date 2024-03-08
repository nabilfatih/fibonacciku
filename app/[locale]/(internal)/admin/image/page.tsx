import { setStaticParamsLocale } from "next-international/server"

import AdminUploadImage from "@/components/admin/change-cover"

export default function AdminImagePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  return (
    <main>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl space-y-6 px-4">
          <h1 className="text-2xl font-bold">Change Blog Cover</h1>

          <AdminUploadImage />
        </div>
      </div>
    </main>
  )
}
