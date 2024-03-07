import type { DialogProps } from "@radix-ui/react-dialog"

import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import Sidebar from "@/components/sidebar"

interface BookDetailsSidebarProps extends DialogProps {
  children: React.ReactNode
}

export default function BookDetailsSidebar({
  children,
  ...props
}: BookDetailsSidebarProps) {
  const t = useScopedI18n("FormChat")
  return (
    <Sheet {...props}>
      <SheetContent side="right" className="bg-muted">
        <SheetHeader>
          <SheetTitle>Book details</SheetTitle>
        </SheetHeader>
        <Sidebar className="grid h-[calc(100%-4rem)]">{children}</Sidebar>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
