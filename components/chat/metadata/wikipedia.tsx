import { memo } from "react"
import { IconBrandWikipedia } from "@tabler/icons-react"
import { AnimatePresence } from "framer-motion"

import type { WikiSearchContentResult } from "@/lib/openai/plugin/wiki"
import { useScopedI18n } from "@/locales/client"

import ChatMetadataWikipediaDialog from "@/components/chat/metadata/wikipedia-dialog"

type Props = {
  metadata: WikiSearchContentResult[]
}

function ChatMetadataWikipedia({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBrandWikipedia className="h-5 w-5" />
        <span className="font-medium">{t("wikipedia")}:</span>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {metadata
            .filter(item => item.thumbnail.url)
            .slice(0, 6)
            .map((item, index) => {
              return (
                <ChatMetadataWikipediaDialog
                  key={item.title || index}
                  item={item}
                />
              )
            })}
        </div>
      </AnimatePresence>
    </div>
  )
}

export default memo(ChatMetadataWikipedia)
