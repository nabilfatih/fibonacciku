import { useState } from "react"
import { IconBulb } from "@tabler/icons-react"

import { useScopedI18n } from "@/locales/client"

type Props = {
  query: string
  document: string
}

export default function BookAssistant({ query, document }: Props) {
  const t = useScopedI18n("Chat")

  const [data, setData] = useState<string>("")
  const [isMinimized, setIsMinimized] = useState<boolean>(false)

  return (
    <header className="border-b py-4">
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="flex items-center gap-2">
          <IconBulb className="h-5 w-5 sm:w-6 sm:h-6" />
          <h2 className="font-semibold sm:text-lg leading-none">
            {t("fibo-assistant")}
          </h2>
        </div>
      </div>
    </header>
  )
}
