import dynamic from "next/dynamic"

const AdminUploadImage = dynamic(
  () => import("@/components/admin/upload-image")
)

export default function AdminImagePage() {
  return (
    <main>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl space-y-6 px-4">
          <h1 className="text-2xl font-bold">Upload Image</h1>

          <AdminUploadImage />
        </div>
      </div>
    </main>
  )
}
