"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useScopedI18n } from "@/locales/client"
import { IconPlus } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const chatFeatures = ["assistant", "document"]

export default function NewChat() {
  const t = useScopedI18n("Chat")

  const pathname = usePathname()
  const params = useParams()

  const feature = String(params.feature)
  const isLibrary = pathname.includes("/library")

  return (
    <div className="mt-4 px-2">
      <Link
        href={
          !chatFeatures.includes(feature)
            ? `/chat/${isLibrary ? "document" : "assistant"}`
            : `/chat/${feature}`
        }
        title={t("new-chat")}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex h-10 w-full items-center justify-start gap-2 px-3 shadow-none transition-colors"
        )}
      >
        <IconPlus className="h-5 w-5" />
        {t("new-chat")}
      </Link>
    </div>
  )
}
