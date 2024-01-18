"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"
import Textarea from "react-textarea-autosize"

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

export interface FormProps extends React.ComponentProps<"div"> {}

export default function BookForm({ className }: FormProps) {
  const t = useScopedI18n("Book")
  const { formRef, onKeyDown } = useEnterSubmit()

  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get("q")?.toString() || ""

  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  React.useEffect(() => {
    setInput(q)
  }, [q])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setIsLoading(true)
        // replace all question mark with %3F and space with +
        router.push(
          `/book/search?q=${input.replaceAll(" ", "+").replaceAll("?", "%3F")}`
        )
      }}
      ref={formRef}
    >
      <div
        className={cn(
          "relative flex max-h-40 w-full grow flex-col overflow-hidden bg-background pr-8 sm:rounded-3xl sm:border sm:pl-2 sm:pr-12",
          className
        )}
      >
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t("placeholder-search")}
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] scrollbar-hide focus-within:outline-none sm:text-sm"
          )}
          data-enable-grammarly="false"
        />
        <div className="absolute bottom-4 right-0 sm:bottom-3 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === "" || isLoading}
              >
                <IconSearch />
                <span className="sr-only">Search</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-muted-background bg-muted-foreground">
              Search
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
