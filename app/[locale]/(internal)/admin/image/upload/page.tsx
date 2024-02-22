import AdminUploadImage from "@/components/admin/upload-image"

export default function AdminImageUploadPage() {
  return (
    <main>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl space-y-6 px-4">
          <h1 className="text-2xl font-bold">Upload Image</h1>
          <p className="text-muted-foreground">
            After you upload the image. You will get the URL of the image. You
            can only see this once. Make sure to save it.
          </p>

          <AdminUploadImage />
        </div>
      </div>
    </main>
  )
}
