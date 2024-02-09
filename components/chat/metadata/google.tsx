import { memo } from "react"
import Image from "next/image"
import { IconWorldWww } from "@tabler/icons-react"
import { motion } from "framer-motion"
import he from "he"

import type { SearchResult } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

type Props = {
  metadata: SearchResult[]
}

function ChatMetadataGoogle({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconWorldWww className="h-5 w-5" />
        <span className="font-medium">{t("related-links")}:</span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {metadata.map((item, index) => {
          return (
            <motion.a
              key={index}
              target="_blank"
              href={item.link}
              rel="noopener noreferrer"
              title={he.decode(item.title)}
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0 }
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                ease: "easeInOut",
                duration: 0.5
              }}
              viewport={{ amount: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="group min-h-[82px] rounded-xl border p-2 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex h-full w-full flex-col items-start justify-between gap-2">
                <span
                  className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-medium"
                  title={he.decode(item.title)}
                >
                  {he.decode(item.title)}
                </span>
                <div className="flex flex-row items-center gap-1">
                  <div
                    className="relative overflow-hidden"
                    style={{ minWidth: "16px" }}
                  >
                    <Image
                      title={he.decode(item.title)}
                      className="m-0 block rounded-full bg-transparent object-contain"
                      src={`https://www.google.com/s2/favicons?domain=${item.displayLink}&sz=512`}
                      width={16}
                      height={16}
                      priority
                      onError={e => (e.currentTarget.src = "/logo-google.png")}
                      alt={he.decode(item.title)}
                      unoptimized // because we want to decrease cost of image optimization
                    />
                  </div>

                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {item.displayLink.split(".").length > 2
                      ? item.displayLink.split(".")[1]
                      : item.displayLink.split(".")[0]}
                  </span>
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ChatMetadataGoogle)
