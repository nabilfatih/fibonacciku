"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useScopedI18n } from "@/locales/client"
import { toast } from "sonner"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { deleteUserChat } from "@/lib/supabase/client/users"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"

type ClearHistoryProps = {
  isEnabled: boolean
}

export default function ClearHistory({ isEnabled = false }: ClearHistoryProps) {
  const t = useScopedI18n("ModalClearChat")
  const { userDetails } = useCurrentUser()

  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  const router = useRouter()

  const handleClearConversations = async () => {
    if (!userDetails) return
    setIsPending(true)
    try {
      await deleteUserChat(userDetails.id)
      router.replace("/chat/assistant")
      toast.success(t("conversations-clear"))
    } catch (error) {
      toast.error(t("something-wrong"))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={!isEnabled || isPending}>
          {isPending && <IconSpinner className="mr-2" />}
          {t("clear-history")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title-clear-history")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("desc-clear-history")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleClearConversations}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
