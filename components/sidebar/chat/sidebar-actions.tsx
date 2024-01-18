"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconDotsVertical,
  IconPencil,
  IconShare3,
  IconTrash
} from "@tabler/icons-react"
import { toast } from "sonner"

import type { Chat, ServerActionResult } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { IconSpinner } from "@/components/ui/icons"
import ChatShareDialog, {
  type ShareChatProps
} from "@/components/chat/share-dialog"
import { ChatRenameDialog } from "@/components/sidebar/chat/rename-dialog"
import { renameChat } from "@/app/actions"

interface SidebarActionsProps {
  chat: Chat
  removeChat: (id: string, path: string) => ServerActionResult<void>
  shareChat: (id: string, type: string) => ServerActionResult<ShareChatProps>
}

export default function SidebarActions({
  chat,
  removeChat,
  shareChat
}: SidebarActionsProps) {
  const t = useScopedI18n("Chat")

  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="h-6 w-6" size="icon">
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full p-2">
          {chat.messages ? (
            <DropdownMenuItem
              role="button"
              onClick={() => {
                setShareDialogOpen(true)
              }}
              className="cursor-pointer space-x-2"
            >
              <IconShare3 className="h-4 w-4" />
              <span>{t("share")}</span>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2"
            onClick={() => {
              setRenameDialogOpen(true)
            }}
          >
            <IconPencil className="h-4 w-4" />
            <span>{t("rename")}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2 !text-destructive"
            onClick={() => {
              setDeleteDialogOpen(true)
            }}
          >
            <IconTrash className="h-4 w-4" />
            <span>{t("delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {chat.messages ? (
        <ChatShareDialog
          chat={{
            id: chat.id,
            title: chat.title,
            message: chat.messages,
            type: chat.type,
            created_at: chat.created_at
          }}
          shareChat={shareChat}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          onCopy={() => setShareDialogOpen(false)}
        />
      ) : null}

      <ChatRenameDialog
        chat={{
          id: chat.id,
          title: chat.title,
          type: chat.type
        }}
        renameChat={renameChat}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onRename={() => setRenameDialogOpen(false)}
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
                event.preventDefault()

                startRemoveTransition(async () => {
                  const result = await removeChat(chat.id, `/chat/${chat.type}`)

                  if (result && "error" in result) {
                    toast.error(result.error)
                    return
                  }

                  setDeleteDialogOpen(false)
                  router.replace(`/chat/${chat.type}`)
                  toast.success("Chat deleted")
                })
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
  )
}
