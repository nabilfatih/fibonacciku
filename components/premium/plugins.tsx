import { IconPuzzle } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Sidebar } from "@/components/sidebar"

type Props = {
  text?: string
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  className?: string
  openTooltip?: boolean
}

export default async function PremiumPlugins({
  text,
  variant,
  className,
  openTooltip
}: Props) {
  const t = await getScopedI18n("ModalPluginChat")

  return (
    <Sheet>
      <Tooltip open={openTooltip}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant={variant ?? "outline"} className={cn(className)}>
              {text ?? <IconPuzzle />}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent align="end">
          <p>{t("plugin")}</p>
        </TooltipContent>
      </Tooltip>

      <SheetContent side="right" className="bg-muted">
        <SheetHeader>
          <SheetTitle>{t("plugin")}</SheetTitle>
        </SheetHeader>
        <Sidebar className="flex">
          <div className="relative py-2">
            <section className="grid gap-4"></section>
          </div>
        </Sidebar>
      </SheetContent>
    </Sheet>
  )
}
