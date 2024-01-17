import { useScopedI18n } from "@/locales/client"
import type { AcademicSearchResult } from "@/types/types"
import { IconBooks } from "@tabler/icons-react"
import Link from "next/link"
import he from "he"
import Image from "next/image"
import { motion } from "framer-motion"

type Props = {
  metadata: AcademicSearchResult[]
}

export default function ChatMetadataAcademic({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBooks className="h-5 w-5" />
        <span className="font-medium">{t("academic-research")}:</span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {metadata.map((item, index) => {
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              initial="hidden"
              animate="visible"
              transition={{
                delay: index * 0.1,
                ease: "easeInOut",
                duration: 0.5
              }}
              viewport={{ amount: 0 }}
              className="group min-h-[82px] rounded-xl border p-2 shadow-sm transition-colors hover:bg-muted/50"
            >
              <Link
                title={he.decode(item.title)}
                className="no-underline hover:no-underline"
                href={item.url}
                target="_blank"
              >
                <div className="flex h-full w-full flex-col items-start justify-between gap-2">
                  <span
                    className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-semibold"
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
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
