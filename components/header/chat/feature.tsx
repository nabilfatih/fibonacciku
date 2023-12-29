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

export default function HeaderChatFeature() {
  const params = useParams();

  const type = params.feature;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button asChild variant="ghost">
          <Link
            href="/chat/assistant"
            className="inline-flex items-center gap-2"
          >
            {type === "assistant" ? (
              <IconMessageCircle2 className="h-5 w-5" />
            ) : (
              <IconFile className="h-5 w-5" />
            )}
            {type === "assistant" ? "Assistant" : "Document"}
            <IconChevronDown className="h-4 w-4" />
          </Link>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} align="start" className="w-full p-2">
        <DropdownMenuLabel
          asChild
          className="cursor-pointer flex-col items-start rounded-sm py-2 transition-colors hover:bg-accent"
        >
          <Link
            href="/chat/assistant"
            className="flex w-full cursor-pointer flex-col"
          >
            <p className="font-medium">Assistant</p>
            <span className="font-normal text-muted-foreground">
              Ask me anything and I will answer you.
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
            <p className="font-medium">Document</p>
            <span className="font-normal text-muted-foreground">
              Upload documents and chat with it.
            </span>
          </Link>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
