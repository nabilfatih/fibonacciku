import { memo } from "react"
import Image from "next/image"
import { IconBooks } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import he from "he"

import type { AcademicSearchResult } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

type Props = {
  metadata: AcademicSearchResult[]
}

function ChatMetadataAcademic({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBooks className="h-5 w-5" />
        <span className="font-medium">{t("academic-research")}:</span>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-2 gap-2">
          {metadata.slice(0, 2).map((item, index) => {
            return (
              <motion.a
                key={item.id || index}
                title={he.decode(item.title)}
                rel="noopener noreferrer"
                href={item.url}
                target="_blank"
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
                <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p
                      className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-semibold"
                      title={he.decode(item.title)}
                    >
                      {he.decode(item.title)}
                    </p>
                    <p
                      className="hidden whitespace-pre-wrap break-all text-xs sm:line-clamp-3"
                      title={he.decode(item.abstract || "")}
                    >
                      {he.decode(item.abstract || "")}
                    </p>
                  </div>

                  <div className="flex flex-row items-center gap-1">
                    <div
                      className="relative overflow-hidden"
                      style={{ minWidth: "16px" }}
                    >
                      <Image
                        title={he.decode(item.title)}
                        className="m-0 block rounded-full bg-transparent object-contain"
                        src="/semantic_logo.webp"
                        width={16}
                        height={16}
                        style={{
                          width: "16px",
                          height: "auto"
                        }}
                        priority
                        alt={he.decode(item.title)}
                      />
                    </div>

                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {item.authors
                        ?.map(author => {
                          return author.name
                        })
                        .join(", ")}
                    </span>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {metadata.slice(2).map((item, index) => {
            return (
              <motion.a
                key={item.id || index}
                title={he.decode(item.title)}
                rel="noopener noreferrer"
                href={item.url}
                target="_blank"
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
                <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                  <p
                    className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-semibold"
                    title={he.decode(item.title)}
                  >
                    {he.decode(item.title)}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    <div
                      className="relative overflow-hidden"
                      style={{ minWidth: "16px" }}
                    >
                      <Image
                        title={he.decode(item.title)}
                        className="m-0 block rounded-full bg-transparent object-contain"
                        src="/semantic_logo.webp"
                        width={16}
                        height={16}
                        style={{
                          width: "16px",
                          height: "auto"
                        }}
                        priority
                        alt={he.decode(item.title)}
                      />
                    </div>

                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {item.authors
                        ?.map(author => {
                          return author.name
                        })
                        .join(", ")}
                    </span>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </AnimatePresence>
    </div>
  )
}

export default memo(ChatMetadataAcademic)
