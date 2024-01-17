"use client"

import React from "react"
import { useScopedI18n } from "@/locales/client"
import { toast } from "sonner"

import type { UserRole } from "@/types/types"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { updateUser } from "@/app/actions"

type Props = {
  userId: string
  role: UserRole
}

export default function AccountRole({ userId, role }: Props) {
  const t = useScopedI18n("ModalAccount")

  const [_, startTransition] = React.useTransition()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <Label className="text-sm text-muted-foreground">{t("role")}</Label>
      <Select
        value={role}
        onValueChange={(value: string) => {
          startTransition(async () => {
            const result = await updateUser(userId, {
              role: value as UserRole
            })

            if (result && "error" in result) {
              toast.error(result.error)
              return
            }
          })
        }}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder={t("role")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("role")}</SelectLabel>
            <SelectItem value="student">{t("student")}</SelectItem>
            <SelectItem value="teacher">{t("teacher")}</SelectItem>
            <SelectItem value="professional">{t("professional")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
