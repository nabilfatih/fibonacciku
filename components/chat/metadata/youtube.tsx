import Image from "next/image"
import Link from "next/link"
import { useScopedI18n } from "@/locales/client"
import { IconBrandYoutube } from "@tabler/icons-react"
import { motion } from "framer-motion"
import he from "he"

import type { YoutubeSearchResult } from "@/types/types"

type Props = {
  metadata: YoutubeSearchResult[]
}

export default function ChatMetadataYoutube({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBrandYoutube className="h-5 w-5" />
        <span className="font-medium">{t("youtube-videos")}:</span>
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
              className="group min-h-[82px] rounded-xl border px-3 py-2 shadow-sm transition-colors hover:bg-muted/50"
              style={{
                backgroundImage: `linear-gradient(rgb(10, 20, 39), rgba(0, 0, 0, 0.1)), url(${item.snippet.thumbnails.high.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <Link
                key={index}
                title={he.decode(item.snippet.title)}
                className="no-underline hover:no-underline"
                href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                target="_blank"
              >
                <div className="flex h-full w-full flex-col items-start justify-between gap-2">
                  <span
                    className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-medium text-zinc-100"
                    title={he.decode(item.snippet.title)}
                  >
                    {he.decode(item.snippet.title)}
                  </span>
                  <div className="flex flex-row items-center gap-1">
                    <div
                      className="relative overflow-hidden"
                      style={{ minWidth: "16px" }}
                    >
                      <Image
                        title={item.snippet.channelTitle}
                        className="m-0 block rounded-full bg-transparent object-contain"
                        src={`/logo-youtube.png`}
                        width={16}
                        height={16}
                        priority
                        alt={item.snippet.channelTitle}
                      />
                    </div>

                    <span className="line-clamp-1 text-xs text-zinc-100">
                      {item.snippet.channelTitle}
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
