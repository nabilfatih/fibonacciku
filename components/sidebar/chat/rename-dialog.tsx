"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { toast } from "sonner"

import type { Chat, ServerActionResult } from "@/types/types"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChatRenameDialogProps extends DialogProps {
  chat: Pick<Chat, "id" | "title" | "type">
  renameChat: (id: string, title: string) => ServerActionResult<void>
  onRename: () => void
}

export function ChatRenameDialog({
  chat,
  renameChat,
  onRename,
  ...props
}: ChatRenameDialogProps) {
  const t = useScopedI18n("RenameDialog")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [title, setTitle] = React.useState<string>(chat.title)

  const [isRenamePending, startRenameTransition] = React.useTransition()

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("rename-this-chat")}</DialogTitle>
            <DialogDescription>{t("rename-desc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t("chat-name")}</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t("chat-name-placeholder")}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter className="items-center">
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>

            <Button
              disabled={isRenamePending || !title.trim()}
              onClick={() => {
                startRenameTransition(async () => {
                  const result = await renameChat(chat.id, title)

                  if (result && "error" in result) {
                    toast.error(result.error)
                    return
                  }

                  onRename()
                  toast.success(t("chat-renamed"))
                })
              }}
            >
              {isRenamePending ? (
                <>
                  <IconSpinner className="mr-2 animate-spin" />
                  {t("renaming")}...
                </>
              ) : (
                t("rename")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("rename-this-chat")}</DrawerTitle>
          <DrawerDescription>{t("rename-desc")}</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t("chat-name")}</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t("chat-name-placeholder")}
              className="w-full"
            />
          </div>

          <Button
            disabled={isRenamePending || !title.trim()}
            onClick={() => {
              startRenameTransition(async () => {
                const result = await renameChat(chat.id, title)

                if (result && "error" in result) {
                  toast.error(result.error)
                  return
                }

                onRename()
                toast.success(t("chat-renamed"))
              })
            }}
          >
            {isRenamePending ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                {t("renaming")}...
              </>
            ) : (
              t("rename")
            )}
          </Button>
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
