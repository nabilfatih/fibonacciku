import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconWorldWww } from "@tabler/icons-react"
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
        <p className="font-medium">{t("related-links")}:</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metadata.slice(0, 2).map((item, index) => {
          return <LinkCard key={item.link} item={item} showSnippet />
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {metadata.slice(2).map((item, index) => {
          return <LinkCard key={item.link} item={item} showSnippet={false} />
        })}
      </div>
    </div>
  )
}

function LinkCard({
  item,
  showSnippet
}: {
  item: SearchResult
  showSnippet: boolean
}) {
  return (
    <Link
      key={item.link}
      target="_blank"
      href={item.link}
      rel="noopener noreferrer"
      title={he.decode(item.title)}
      className="group min-h-[82px] rounded-xl border p-2 shadow transition-colors hover:bg-muted/50"
    >
      <div className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden">
        <div className="flex flex-col gap-1">
          <p
            className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
            title={he.decode(item.title)}
          >
            {he.decode(item.title)}
          </p>
          {showSnippet && (
            <p
              className="hidden whitespace-pre-wrap break-words text-xs sm:line-clamp-3"
              title={he.decode(item.snippet)}
            >
              {he.decode(item.snippet)}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center gap-1">
          <div
            className="relative overflow-hidden"
            style={{ minWidth: "16px" }}
          >
            <Image
              title={he.decode(item.title)}
              className="m-0 block rounded-full bg-transparent object-contain"
              src={`https://www.google.com/s2/favicons?domain=${item.displayLink}&sz=512`}
              sizes="16px"
              width={16}
              height={16}
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
    </Link>
  )
}

export default memo(ChatMetadataGoogle)
