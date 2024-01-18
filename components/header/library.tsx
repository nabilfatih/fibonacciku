import Link from "next/link"
import { IconBook } from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

export default async function HeaderChatLibrary() {
  const t = await getScopedI18n("Library")
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          asChild
          className="flex h-9 w-9 p-0 sm:w-auto sm:px-4 sm:py-2"
        >
          <Link href="/chat/library">
            <IconBook className="sm:hidden" />
            <span className="sr-only sm:hidden">{t("library")}</span>
            <span className="hidden sm:inline">{t("library")}</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="sm:hidden" align="end">
        {t("library")}
      </TooltipContent>
    </Tooltip>
  )
}
