"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import type { ServerActionResult, Chat } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconSpinner } from "@/components/ui/icons";
import {
  ChatShareDialog,
  type ShareChatProps,
} from "@/components/chat/share-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconPencil,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import { cn } from "@/lib/utils";
import { renameChat } from "@/app/actions";
import { ChatRenameDialog } from "./rename-dialog";

interface SidebarActionsProps {
  chat: Chat;
  removeChat: (id: string, path: string) => ServerActionResult<void>;
  shareChat: (id: string, type: string) => ServerActionResult<ShareChatProps>;
}

export function SidebarActions({
  chat,
  removeChat,
  shareChat,
}: SidebarActionsProps) {
  const t = useScopedI18n("Chat");

  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [isRemovePending, startRemoveTransition] = React.useTransition();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="h-6 w-6" size="icon">
            <IconDotsVertical className="h-5 w-5" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full p-2">
          <DropdownMenuItem
            role="button"
            onClick={() => {
              setShareDialogOpen(true);
            }}
            className="cursor-pointer space-x-2"
          >
            <IconShare3 className="h-5 w-5" />
            <span>{t("share")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2"
            onClick={() => {
              setRenameDialogOpen(true);
            }}
          >
            <IconPencil className="h-5 w-5" />
            <span>{t("rename")}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2 text-destructive"
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
          >
            <IconTrash className="h-5 w-5" />
            <span>{t("delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChatShareDialog
        chat={{
          id: chat.id,
          title: chat.title,
          message: chat.messages,
          type: chat.type,
          createdAt: chat.created_at,
        }}
        shareChat={shareChat}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onCopy={() => setShareDialogOpen(false)}
      />

      <ChatRenameDialog
        chat={{
          id: chat.id,
        }}
        renameChat={renameChat}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onRename={() => setShareDialogOpen(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your chat message and remove your
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={event => {
                event.preventDefault();

                startRemoveTransition(async () => {
                  const result = await removeChat(
                    chat.id,
                    `/chat/${chat.type}`
                  );

                  if (result && "error" in result) {
                    toast.error(result.error);
                    return;
                  }

                  setDeleteDialogOpen(false);
                  router.refresh();
                  router.push(`/chat/${chat.type}`);
                  toast.success("Chat deleted");
                });
              }}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
