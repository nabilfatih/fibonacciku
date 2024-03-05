import { memo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconBooks } from "@tabler/icons-react"
import he from "he"

import type { AcademicSearchResult } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import MetadataSidebar from "@/components/chat/metadata/sidebar"

type Props = {
  metadata: AcademicSearchResult[]
}

function ChatMetadataAcademic({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconBooks className="h-5 w-5" />
        <p className="font-medium">{t("academic-research")}:</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metadata.slice(0, 2).map((item, index) => {
          return (
            <LinkCard
              key={item.id || item.title}
              item={item}
              index={index}
              showAbstract
            />
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {metadata.slice(2, 4).map((item, index) => {
          return (
            <LinkCard
              key={item.id || item.title}
              item={item}
              index={index}
              showAbstract={false}
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
                        <LinkIcon key={item.id || item.title} item={item} />
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
            <IconBooks className="mr-1 h-5 w-5" />
            <p>{t("academic-research")}</p>
          </>
        }
      >
        <div className="grid h-[calc(100%-4rem)]">
          <div className="relative my-4 overflow-y-auto border-y py-4">
            <div className="mb-4 flex h-full flex-col space-y-2 px-4">
              {metadata.map((item, index) => {
                return (
                  <LinkCard
                    key={item.id || item.title}
                    item={item}
                    index={index}
                    className="bg-card hover:bg-card/50"
                    showAbstract
                  />
                )
              })}
            </div>
          </div>
        </div>
      </MetadataSidebar>
    </div>
  )
}

function LinkCard({
  item,
  index,
  showAbstract,
  className
}: {
  item: AcademicSearchResult
  index: number
  showAbstract: boolean
  className?: string
}) {
  return (
    <Link
      key={item.id || index}
      title={he.decode(item.title)}
      rel="noopener noreferrer"
      href={item.url}
      target="_blank"
      className={cn(
        "group rounded-xl border p-2 shadow transition-colors hover:bg-muted/50",
        className
      )}
    >
      <div className="flex h-full w-full flex-col items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p
            className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-semibold"
            title={he.decode(item.title)}
          >
            {he.decode(item.title)}
          </p>
          {showAbstract && (
            <p
              className="line-clamp-3 whitespace-pre-wrap break-words text-xs"
              title={he.decode(item.abstract || "")}
            >
              {he.decode(item.abstract || "")}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center gap-1">
          <LinkIcon item={item} />

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
  )
}

function LinkIcon({ item }: { item: AcademicSearchResult }) {
  return (
    <div className="relative overflow-hidden" style={{ minWidth: "16px" }}>
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
        alt={he.decode(item.title)}
      />
    </div>
  )
}

export default memo(ChatMetadataAcademic)
