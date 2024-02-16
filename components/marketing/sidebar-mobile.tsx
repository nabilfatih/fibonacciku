import Link from "next/link"
import { IconExternalLink, IconLayoutSidebar } from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

export default async function MarketingSidebarMobile() {
  const t = await getScopedI18n("Marketing")
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 flex h-9 w-9 p-0 sm:hidden">
          <IconLayoutSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-muted">
        <Sidebar className="grid">
          <div className="relative py-2">
            <section className="grid gap-4 py-10">
              <Link
                href="/chat/assistant"
                className="inline-flex justify-between border-t pt-4 text-sm underline-offset-4 hover:underline"
              >
                {t("fibo-assistant")}
              </Link>

              <Link
                href="/blog"
                className="inline-flex justify-between border-t pt-4 text-sm underline-offset-4 hover:underline"
              >
                {t("blog")}
              </Link>

              <Link
                href="/chat/assistant"
                className="inline-flex justify-between border-y py-4 text-sm underline-offset-4 hover:underline"
              >
                {t("try-fibo")}
                <IconExternalLink className="h-4 w-4" />
              </Link>
            </section>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">{t("close")}</Button>
            </SheetClose>
          </SheetFooter>
        </Sidebar>
      </SheetContent>
    </Sheet>
  )
}
