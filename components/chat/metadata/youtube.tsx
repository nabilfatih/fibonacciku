import { memo } from "react"
import Image from "next/image"
import { IconBrandYoutube } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import he from "he"

import type { YoutubeSearchResult } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

type Props = {
  metadata: YoutubeSearchResult[]
}

function ChatMetadataYoutube({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBrandYoutube className="h-5 w-5" />
        <span className="font-medium">{t("youtube-videos")}:</span>
      </div>

      <AnimatePresence initial={false}>
        <div className="grid grid-cols-2 gap-2">
          {metadata.slice(0, 2).map((item, index) => {
            return (
              <LinkCard
                key={item.id.videoId || index}
                item={item}
                index={index}
                showDescription
              />
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {metadata.slice(2).map((item, index) => {
            return (
              <LinkCard
                key={item.id.videoId || index}
                item={item}
                index={index}
                showDescription={false}
              />
            )
          })}
        </div>
      </AnimatePresence>
    </div>
  )
}

function LinkCard({
  item,
  index,
  showDescription
}: {
  item: YoutubeSearchResult
  index: number
  showDescription: boolean
}) {
  return (
    <motion.a
      key={item.id.videoId || index}
      title={he.decode(item.snippet.title)}
      rel="noopener noreferrer"
      href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
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
      className="group min-h-[82px] rounded-xl border px-3 py-2 shadow-sm transition-colors hover:bg-muted/50"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 20, 39, 0.7), rgba(10, 20, 39, 0.7)), url(${item.snippet.thumbnails.high.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex h-full w-full flex-col items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p
            className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-medium text-zinc-100"
            title={he.decode(item.snippet.title)}
          >
            {he.decode(item.snippet.title)}
          </p>
          {showDescription && (
            <p
              className="hidden whitespace-pre-wrap break-all text-xs text-zinc-100/80 sm:line-clamp-3"
              title={he.decode(item.snippet?.description || "")}
            >
              {he.decode(item.snippet?.description || "")}
            </p>
          )}
        </div>

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
    </motion.a>
  )
}

export default memo(ChatMetadataYoutube)
