"use client"

import { useTheme } from "next-themes"

import { themes } from "@/lib/data/themes"
import { capitalizeFirstLetter } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

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
import { updateUser } from "@/app/actions/users"

export default function AccountTheme() {
  const t = useScopedI18n("ModalAccount")
  const { setTheme, theme } = useTheme()

  if (!theme) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <Label className="text-sm text-muted-foreground">
        {t("theme-preference")}
      </Label>
      <div className="flex items-center gap-2">
        <Select
          value={theme}
          onValueChange={async value => {
            setTheme(value)
            await updateUser({ theme: value })
          }}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("theme")}</SelectLabel>
              {themes.map(theme => (
                <SelectItem key={theme} value={theme}>
                  {capitalizeFirstLetter(theme)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
