import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconBrandYoutube } from "@tabler/icons-react"
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
    <Link
      key={item.id.videoId || index}
      title={he.decode(item.snippet.title)}
      rel="noopener noreferrer"
      href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
      target="_blank"
      className="group min-h-[82px] rounded-xl border p-2 shadow transition-colors hover:bg-muted/50"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 20, 39, 0.7), rgba(10, 20, 39, 0.7)), url(${item.snippet.thumbnails.high.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex h-full w-full flex-col items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p
            className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium text-zinc-100"
            title={he.decode(item.snippet.title)}
          >
            {he.decode(item.snippet.title)}
          </p>
          {showDescription && (
            <p
              className="hidden whitespace-pre-wrap break-words text-xs text-zinc-100/80 sm:line-clamp-3"
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
              src="/logo-youtube.png"
              width={16}
              height={16}
              alt={item.snippet.channelTitle}
            />
          </div>

          <span className="line-clamp-1 text-xs text-zinc-100">
            {item.snippet.channelTitle}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default memo(ChatMetadataYoutube)
