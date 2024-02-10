import { memo, useState } from "react"
import Image from "next/image"
import { IconBrandWikipedia } from "@tabler/icons-react"
import he from "he"

import type { WikiSearchContentResult } from "@/lib/openai/plugin/wiki"
import { useScopedI18n } from "@/locales/client"

import ChatMetadataWikipediaDialog from "@/components/chat/metadata/wikipedia-dialog"

type Props = {
  metadata: WikiSearchContentResult[]
}

function ChatMetadataWikipedia({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  const [open, setOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] =
    useState<WikiSearchContentResult | null>(null)

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBrandWikipedia className="h-5 w-5" />
        <span className="font-medium">{t("wikipedia")}:</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {metadata
          .filter(item => item.thumbnail.url)
          .slice(0, 6)
          .map((item, index) => {
            return (
              <div
                key={item.title || index}
                className="group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-colors hover:bg-muted/50"
                onClick={() => {
                  setSelectedItem(item)
                  setOpen(true)
                }}
              >
                <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 p-2">
                    <p
                      className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
                      title={he.decode(item.title)}
                    >
                      {he.decode(item.title)}
                    </p>

                    <p
                      className="whitespace-pre-wrap break-words text-xs first-letter:uppercase"
                      title={he.decode(item.description)}
                    >
                      {he.decode(item.description)}
                    </p>
                  </div>

                  <div className="relative h-36 w-full border-t sm:h-48">
                    <Image
                      src={item.thumbnail.url || "/fibo-assistant.webp"}
                      alt={item.title}
                      sizes="100%"
                      fill
                      unoptimized // decrease cost of image optimization
                      className="bg-muted/90 object-cover"
                    />
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {selectedItem && (
        <ChatMetadataWikipediaDialog
          item={selectedItem}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  )
}

export default memo(ChatMetadataWikipedia)
