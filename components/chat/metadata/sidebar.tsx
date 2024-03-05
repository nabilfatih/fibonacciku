import { memo } from "react"
import type { DialogProps } from "@radix-ui/react-dialog"

import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"

interface Props extends DialogProps {
  title: React.ReactNode
  description?: string
  children: React.ReactNode
}

function MetadataSidebar({ title, description, children, ...props }: Props) {
  const t = useScopedI18n("FormChat")
  return (
    <Sheet {...props}>
      <SheetContent side="right" className="bg-muted px-0 py-4">
        <SheetHeader className="px-4">
          <SheetTitle className="flex items-center">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
        <SheetFooter className="px-4">
          <SheetClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default memo(MetadataSidebar)
