import Link from "next/link"
import { setStaticParamsLocale } from "next-international/server"

import { Button } from "@/components/ui/button"

export default function AdminPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  return (
    <main>
      <div className="bg-muted py-16 sm:py-24">
        <h1 className="relative mx-auto w-fit px-4 text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
          Internal Admin Panel
        </h1>
      </div>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl space-x-4 space-y-4 px-4">
          <Button>
            <Link href="/admin/blog">Insert Blog</Link>
          </Button>
          <Button>
            <Link href="/admin/image">Change Blog Cover</Link>
          </Button>
          <Button>
            <Link href="/admin/image/upload">Upload Image</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
