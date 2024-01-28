import { useState } from "react"
import Link from "next/link"
import { IconBulb } from "@tabler/icons-react"
import useSWRImmutable from "swr/immutable"

import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import BookAssistantResult from "@/components/book/assistant-result"

type Props = {
  query: string
  document: string
}

async function askAssistant(
  query: string,
  document: string,
  errorMessage: string
): Promise<string> {
  try {
    const response = await fetch("/api/ai/book/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, document })
    })
    const data = response.body
    if (!data) throw new Error("No data")
    const reader = data.getReader()
    const decoder = new TextDecoder()

    let result = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      const chunkValue = decoder.decode(value, { stream: true })
      if (chunkValue) {
        result += chunkValue
      }
    }
    return result
  } catch (err) {
    return `[${errorMessage}](https://www.fibonacciku.com/chat/assistant)`
  }
}

export default function BookAssistant({ query, document }: Props) {
  const t = useScopedI18n("Chat")

  const { data: assistant, isLoading } = useSWRImmutable([query], ([query]) =>
    askAssistant(query, document, t("ask-fibo-assistant"))
  )

  const [isMinimized, setIsMinimized] = useState<boolean>(false)

  return (
    <header className="border-b py-4">
      <div className="relative mx-auto max-w-2xl px-4 sm:px-5">
        <div className="mb-4 flex items-center gap-2 border-b pb-4">
          <h2 className="font-semibold leading-none sm:text-lg">
            {t("fibo-assistant")}
          </h2>
          <IconBulb className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        {!isMinimized &&
          (isLoading ? (
            <div>
              <IconSpinner className="animate-spin" />
            </div>
          ) : (
            <>
              {!assistant ? (
                <Button asChild variant="link" className="p-0">
                  <Link href="/chat/assistant">{t("ask-fibo-assistant")}</Link>
                </Button>
              ) : (
                <BookAssistantResult result={assistant} />
              )}
            </>
          ))}

        {assistant && (
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="link"
            className="p-0"
          >
            {isMinimized ? t("show") : t("hide")}
          </Button>
        )}
      </div>
    </header>
  )
}
