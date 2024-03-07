import { memo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconBrandYoutube } from "@tabler/icons-react"
import he from "he"

import type { YoutubeSearchResult } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { ScrollArea } from "@/components/ui/scroll-area"
import MetadataSidebar from "@/components/chat/metadata/sidebar"

type Props = {
  metadata: YoutubeSearchResult[]
}

function ChatMetadataYoutube({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBrandYoutube className="h-5 w-5" />
        <p className="font-medium">{t("youtube-videos")}:</p>
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
        {metadata.slice(2, 4).map((item, index) => {
          return (
            <LinkCard
              key={item.id.videoId || index}
              item={item}
              index={index}
              showDescription={false}
            />
          )
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
                  {
                    // show only 1 icon, cause all the remaining icons are the same
                    metadata.slice(4, 5).map((item, index) => {
                      return (
                        <LinkIcon key={item.id.videoId || index} item={item} />
                      )
                    })
                  }
                  {
                    // show many links, only number of links
                    <p className="line-clamp-1 text-xs">
                      {metadata.length - 4} +
                    </p>
                  }
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
            <IconBrandYoutube className="mr-1 h-5 w-5" />
            <p>{t("youtube-videos")}</p>
          </>
        }
      >
        <div className="grid h-[calc(100%-4rem)]">
          <ScrollArea className="relative my-4 border-y">
            <div className="my-4 flex h-full flex-col space-y-2 px-4">
              {metadata.map((item, index) => {
                return (
                  <LinkCard
                    key={item.id.videoId || index}
                    item={item}
                    index={index}
                    className="hover:bg-card/50"
                    showDescription
                  />
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </MetadataSidebar>
    </div>
  )
}

function LinkCard({
  item,
  index,
  showDescription,
  className
}: {
  item: YoutubeSearchResult
  index: number
  showDescription: boolean
  className?: string
}) {
  return (
    <Link
      key={item.id.videoId || index}
      title={he.decode(item.snippet.title)}
      rel="noopener noreferrer"
      href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
      target="_blank"
      className={cn(
        "group rounded-xl border p-2 shadow transition-colors hover:bg-muted/50",
        className
      )}
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
              className="hidden whitespace-pre-wrap break-all text-xs text-zinc-100/80 sm:line-clamp-3"
              title={he.decode(item.snippet?.description || "")}
            >
              {he.decode(item.snippet?.description || "")}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center gap-1">
          <LinkIcon item={item} />

          <span className="line-clamp-1 text-xs text-zinc-100">
            {item.snippet.channelTitle}
          </span>
        </div>
      </div>
    </Link>
  )
}

function LinkIcon({ item }: { item: YoutubeSearchResult }) {
  return (
    <div className="relative overflow-hidden" style={{ minWidth: "16px" }}>
      <Image
        title={he.decode(item.snippet.title)}
        className="m-0 block rounded-full bg-transparent object-contain"
        src="/logo-youtube.png"
        width={16}
        height={16}
        alt={item.snippet.title}
      />
    </div>
  )
}

export default memo(ChatMetadataYoutube)
