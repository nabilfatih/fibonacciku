"use client";

import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconChevronDown,
  IconFile,
  IconMessageCircle2,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";

export default function HeaderChatFeature() {
  const t = useScopedI18n("Feature");
  const params = useParams();

  const type = params.feature;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {type === "assistant" ? (
            <IconMessageCircle2 className="mr-2 h-5 w-5" />
          ) : (
            <IconFile className="mr-2 h-5 w-5" />
          )}
          {type === "assistant" ? t("assistant") : t("document")}
          <IconChevronDown className="ml-1.5 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} align="end" className="w-full p-2">
        <DropdownMenuLabel
          asChild
          className="cursor-pointer flex-col items-start rounded-sm py-2 transition-colors hover:bg-accent"
        >
          <Link
            href="/chat/assistant"
            className="flex w-full cursor-pointer flex-col"
          >
            <p className="font-medium">{t("assistant")}</p>
            <span className="font-normal text-muted-foreground">
              {t("assistant-desc")}
            </span>
          </Link>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuLabel
          asChild
          className="cursor-pointer flex-col items-start rounded-sm py-2 transition-colors hover:bg-accent"
        >
          <Link
            href="/chat/document"
            className="flex w-full cursor-pointer flex-col"
          >
            <p className="font-medium">{t("document")}</p>
            <span className="font-normal text-muted-foreground">
              {t("document-desc")}
            </span>
          </Link>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
