import { memo } from "react"
import { useParams } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"

import { useMessage } from "@/lib/context/use-message"
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

interface ChatDocumentSidebarProps extends DialogProps {
  children: React.ReactNode
}

function ChatDocumentSidebar({ children, ...props }: ChatDocumentSidebarProps) {
  const t = useScopedI18n("FormChat")
  const { state, dispatch } = useMessage()

  const params = useParams()
  const feature = params.feature as string

  return (
    <Sheet
      {...props}
      open={state.openDocument}
      onOpenChange={open =>
        dispatch({ type: "SET_OPEN_DOCUMENT", payload: open })
      }
    >
      <SheetContent side="right" className="w-full bg-muted sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{t(feature as never)}</SheetTitle>
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

export default memo(ChatDocumentSidebar)
