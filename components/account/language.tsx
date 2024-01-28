"use client"

import React from "react"

import { updateUserLang } from "@/lib/supabase/client/users"
import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n
} from "@/locales/client"

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

export const languages = [
  {
    icon: "🇬🇧",
    name: "English",
    value: "en"
  },
  {
    icon: "🇮🇩",
    name: "Indonesia",
    value: "id"
  },
  {
    icon: "🇩🇪",
    name: "Deutsch",
    value: "de"
  },
  {
    icon: "🇷🇺",
    name: "Русский",
    value: "ru"
  }
]

type Props = {
  userId: string
}

export default function AccountLanguage({ userId }: Props) {
  const lang = useCurrentLocale()

  const t = useScopedI18n("ModalAccount")
  const changeLocale = useChangeLocale({ preserveSearchParams: true })

  const handleChangeLocale = async (value: string) => {
    changeLocale(value as never)
    await updateUserLang(userId, value)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <Label className="text-sm text-muted-foreground">
        {t("language-preference")}
      </Label>
      <Select value={lang} onValueChange={handleChangeLocale}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder={t("language")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("language")}</SelectLabel>
            {languages.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
