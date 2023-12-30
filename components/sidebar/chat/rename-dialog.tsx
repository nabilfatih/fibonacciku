"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import type { Chat, ServerActionResult, ShowChatMessage } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { IconSpinner } from "@/components/ui/icons";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { useScopedI18n } from "@/locales/client";
import moment from "moment";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface ChatShareDialogProps extends DialogProps {
  chat: Pick<Chat, "id">;
  renameChat: (id: string, type: string, path: string) => void;
  onRename: () => void;
}

export function ChatRenameDialog({
  chat,
  renameChat,
  onRename,
  ...props
}: ChatShareDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [title, setTitle] = React.useState<string>("");

  if (isDesktop) {
    return <></>;
  }

  return <></>;
}
