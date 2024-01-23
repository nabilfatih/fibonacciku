"use client"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n
} from "@/locales/client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { languages } from "@/components/account/language"

export default function AuthLanguage() {
  const lang = useCurrentLocale()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const t = useScopedI18n("ModalAccount")
  const changeLocale = useChangeLocale({ preserveSearchParams: true })

  return (
    <Select
      value={lang}
      onValueChange={value => changeLocale(value.toLowerCase() as never)}
    >
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>{t("language")}</SelectLabel>
          {languages.map((item, index) => (
            <SelectItem key={index} value={item.value}>
              {isDesktop ? item.name : item.value.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
