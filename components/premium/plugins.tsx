import { IconPuzzle } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

type Props = {
  children: React.ReactNode
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
}

export default function PremiumPlugins({
  children,
  text,
  variant,
  className
}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={variant ?? "outline"} className={cn(className)}>
          {text ?? <IconPuzzle />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-0 flex h-auto w-[300px] flex-col bg-muted p-0"
      >
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  )
}
