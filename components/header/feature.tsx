"use client";

import { useParams, usePathname } from "next/navigation";
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
  IconApps,
  IconChevronDown,
  IconFile,
  IconMessageCircle2,
  IconPlus,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";

const features = new Set(["assistant", "document"]);

export default function HeaderChatFeature() {
  const t = useScopedI18n("Feature");
  const pathname = usePathname();
  const params = useParams();

  const type = params.feature as string;

  if (!features.has(type)) {
    return (
      <Button asChild variant="outline" className="h-9 w-9 sm:h-9 sm:w-auto">
        <Link
          href={
            pathname.includes("/library") ? "/chat/document" : "/chat/assistant"
          }
        >
          <div className="hidden items-center sm:flex">
            <IconPlus className="mr-2 h-4 w-4" />
            {t("new-chat")}
          </div>
          <div className="inline-flex sm:hidden">
            <IconPlus className="h-5 w-5" />
            <span className="sr-only">New chat</span>
          </div>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-9 sm:h-9 sm:w-auto">
          <div className="hidden items-center sm:flex">
            {type === "assistant" ? (
              <IconMessageCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <IconFile className="mr-2 h-4 w-4" />
            )}
            {type === "assistant" ? t("assistant") : t("document")}
            <IconChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="inline-flex sm:hidden">
            <IconApps className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </div>
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
            <span className="max-w-xs whitespace-pre-wrap break-words font-normal text-muted-foreground sm:max-w-none">
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
            <span className="max-w-xs whitespace-pre-wrap break-words font-normal text-muted-foreground sm:max-w-none">
              {t("document-desc")}
            </span>
          </Link>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
