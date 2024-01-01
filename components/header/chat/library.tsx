import { Button } from "@/components/ui/button";
import { IconBook } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { getScopedI18n } from "@/locales/server";

export default async function HeaderChatLibrary() {
  const t = await getScopedI18n("Library");
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/chat/library">
            <IconBook className="h-6 w-6" />
            <span className="sr-only">{t("library")}</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent align="end">{t("library")}</TooltipContent>
    </Tooltip>
  );
}
