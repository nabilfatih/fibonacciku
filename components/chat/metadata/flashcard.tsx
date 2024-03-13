import { memo, useState } from "react"
import { IconCards } from "@tabler/icons-react"

import type { Flashcard } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { ScrollArea } from "@/components/ui/scroll-area"
import MetadataSidebar from "@/components/chat/metadata/sidebar"

type Props = {
  metadata: Flashcard[]
}

function ChatMetadataFlashcard({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconCards className="h-5 w-5" />
        <p className="font-medium">{t("flashcards")}:</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metadata.slice(0, 2).map((item, index) => {
          return <Card key={item.id} item={item} />
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {metadata.slice(2, 4).map((item, index) => {
          return <Card key={item.id} item={item} />
        })}
        {
          // if there is more than 4 links, show the remaining links
          metadata.length > 4 && (
            <div
              role="button"
              className="group cursor-pointer rounded-xl border p-2 shadow transition-colors hover:bg-muted/50"
              onClick={() => setOpen(true)}
            >
              <div className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <IconCards className="h-4 w-4" />

                  <p className="line-clamp-1 text-xs">
                    {metadata.length - 4} +
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  {t("show-more")}
                </p>
              </div>
            </div>
          )
        }
      </div>

      <MetadataSidebar
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <IconCards className="mr-1 h-5 w-5" />
            {t("flashcards")}
          </>
        }
      >
        <div className="grid h-[calc(100%-4rem)]">
          <ScrollArea className="relative my-4 border-y">
            <div className="my-4 flex h-full flex-col space-y-2 px-4">
              {metadata.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group rounded-xl border p-2 shadow transition-colors hover:bg-muted/50",
                      "bg-card hover:bg-card/50"
                    )}
                  >
                    <div className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden">
                      <p
                        className="whitespace-pre-wrap break-words text-sm font-medium"
                        title={item.front}
                      >
                        {item.front}
                      </p>
                      <p
                        className="whitespace-pre-wrap text-xs"
                        title={item.back}
                      >
                        {item.back}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </MetadataSidebar>
    </div>
  )
}

function Card({ item, className }: { item: Flashcard; className?: string }) {
  return (
    <div
      className={cn(
        "group rounded-xl border p-2 shadow transition-colors hover:bg-muted/50",
        className
      )}
    >
      <div className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden">
        <p
          className="line-clamp-1 whitespace-pre-wrap break-words text-sm font-medium"
          title={item.front}
        >
          {item.front}
        </p>
        <p
          className="line-clamp-2 whitespace-pre-wrap text-xs"
          title={item.back}
        >
          {item.back}
        </p>
      </div>
    </div>
  )
}

export default memo(ChatMetadataFlashcard)
