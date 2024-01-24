"use client"

import React from "react"
import { debounce } from "lodash"
import { toast } from "sonner"

import { useScopedI18n } from "@/locales/client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUser } from "@/app/actions/users"

type Props = {
  userId: string
  fullName: string
}

export default function AccountName({ userId, fullName }: Props) {
  const t = useScopedI18n("ModalAccount")
  const [_, startTransition] = React.useTransition()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <Label className="text-sm text-muted-foreground">{t("full-name")}</Label>
      <Input
        defaultValue={fullName}
        onChange={debounce(async e => {
          startTransition(async () => {
            const result = await updateUser(userId, {
              full_name: e.target.value
            })

            if (result && "error" in result) {
              toast.error(result.error)
              return
            }
          })
        }, 1000)}
        className="w-fit max-w-32 sm:max-w-fit"
        placeholder={t("full-name")}
      />
    </div>
  )
}
