"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
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
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import { deleteUser } from "@/app/actions/users"

export default function AccountDelete() {
  const t = useScopedI18n("DeleteDialog")
  const router = useRouter()

  const [isPending, startTransition] = React.useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <IconTrash className="mr-2 h-4 w-4" />
          {t("delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete-account-desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={async () => {
              startTransition(async () => {
                const result = await deleteUser()

                if (result && "error" in result) {
                  toast.error(result.error)
                  return
                }

                await supabaseClient.auth.signOut()
                router.replace("/auth/login")
              })
            }}
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
