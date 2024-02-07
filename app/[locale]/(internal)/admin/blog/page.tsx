import Link from "next/link"
import { IconHome2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export default function AdminBlogPage() {
  return (
    <main>
      <div className="bg-muted py-2">
        <div className="relative mx-auto max-w-3xl px-4">
          <Button size="icon" variant="outline" asChild className="p-0">
            <Link href="/admin">
              <IconHome2 className="h-5 w-5" />
              <span className="sr-only">Admin Panel</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl px-4">
          <h1 className="text-2xl font-bold">Insert Blog</h1>

          <div></div>
        </div>
      </div>
    </main>
  )
}
