import { memo } from "react"
import { IconBrandWikipedia } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"

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
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -10 },
            visible: { opacity: 1, y: 0 }
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            ease: "easeInOut",
            duration: 0.5
          }}
          viewport={{ amount: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
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
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default memo(ChatMetadataWikipedia)
