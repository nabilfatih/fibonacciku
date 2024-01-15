import { useScopedI18n } from "@/locales/client"
import { IconBulb } from "@tabler/icons-react"
import { useState } from "react"

type Props = {
  query: string
  document: string
}

export default function BookAssistant({ query, document }: Props) {
  const t = useScopedI18n("Chat")

  const [data, setData] = useState<string>("")
  const [isMinimized, setIsMinimized] = useState<boolean>(false)

  return (
    <header className="border-b pb-4">
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="flex items-center gap-2">
          <IconBulb className="h-5 w-5" />
          <h2 className="leading-none font-semibold">
            {t("fibo-assistant")}
          </h2>
        </div>
      </div>
    </header>
  )
}
