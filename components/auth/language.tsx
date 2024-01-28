"use client"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"
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

type Props = {
  align?: "center" | "end" | "start" | undefined
  longName?: boolean
  className?: string
}

export default function AuthLanguage({
  align = "end",
  longName = true,
  className
}: Props) {
  const lang = useCurrentLocale()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const t = useScopedI18n("ModalAccount")
  const changeLocale = useChangeLocale({ preserveSearchParams: true })

  return (
    <Select
      value={lang}
      onValueChange={value => changeLocale(value.toLowerCase() as never)}
    >
      <SelectTrigger className={cn("w-fit", className)}>
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent align={align}>
        <SelectGroup>
          <SelectLabel>{t("language")}</SelectLabel>
          {languages.map((item, index) => (
            <SelectItem key={index} value={item.value}>
              {isDesktop && longName ? item.name : item.value.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
