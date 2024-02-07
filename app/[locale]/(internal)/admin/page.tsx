import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <main>
      <div className="bg-muted py-24 sm:py-32">
        <h1 className="relative mx-auto w-fit px-4 text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
          Internal Admin Panel
        </h1>
      </div>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl px-4">
          <Button>
            <Link href="/admin/blog">Insert Blog</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
