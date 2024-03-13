import { memo, useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconDownload, IconWorldWww } from "@tabler/icons-react"
import he from "he"
import { json2csv } from "json-2-csv"
import { toast } from "sonner"

import type { SearchResult } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import MetadataSidebar from "@/components/chat/metadata/sidebar"

type Props = {
  metadata: SearchResult[]
}

function ChatMetadataGoogle({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  const [open, setOpen] = useState<boolean>(false)

  const handleDownload = useCallback(() => {
    const cleanData = metadata.map(item => {
      return {
        Title: he.decode(item.title),
        Website:
          item.displayLink.split(".").length > 2
            ? item.displayLink.split(".")[1]
            : item.displayLink.split(".")[0],
        Link: item.link,
        Snippet: he.decode(item.snippet)
      }
    })
    const csv = json2csv(cleanData)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "search-results.csv"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(t("exported-success"))
  }, [metadata, t])

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
        {metadata.slice(2, 4).map((item, index) => {
          return <LinkCard key={item.link} item={item} showSnippet={false} />
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
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {
                    // show all the remaining links, only the icon
                    metadata.slice(4).map((item, index) => {
                      return <LinkIcon key={item.link} item={item} />
                    })
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

      <Button className="w-fit" size="sm" onClick={handleDownload}>
        <IconDownload className="mr-1 h-4 w-4" />
        {t("export-to-csv")}
      </Button>

      <MetadataSidebar
        open={open}
        onOpenChange={setOpen}
        title={
          <>
            <IconWorldWww className="mr-1 h-5 w-5" />
            <p>{t("related-links")}</p>
          </>
        }
      >
        <div className="grid h-[calc(100%-4rem)]">
          <ScrollArea className="relative my-4 border-y">
            <div className="my-4 flex h-full flex-col space-y-2 px-4">
              {metadata.map((item, index) => {
                return (
                  <LinkCard
                    key={item.link}
                    item={item}
                    className="bg-card hover:bg-card/50"
                    showSnippet
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
  showSnippet,
  className
}: {
  item: SearchResult
  showSnippet: boolean
  className?: string
}) {
  return (
    <Link
      key={item.link}
      target="_blank"
      href={item.link}
      rel="noopener noreferrer"
      title={he.decode(item.title)}
      className={cn(
        "group rounded-xl border p-2 shadow transition-colors hover:bg-muted/50",
        className
      )}
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
              className="line-clamp-3 whitespace-pre-wrap break-all text-xs"
              title={he.decode(item.snippet)}
            >
              {he.decode(item.snippet)}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center gap-1">
          <LinkIcon item={item} />

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

function LinkIcon({ item }: { item: SearchResult }) {
  return (
    <div className="relative overflow-hidden" style={{ minWidth: "16px" }}>
      <Image
        title={he.decode(item.title)}
        className="m-0 block rounded-full bg-transparent object-contain"
        src={`https://www.google.com/s2/favicons?domain=${item.displayLink}&sz=128`}
        sizes="16px"
        width={16}
        height={16}
        onError={e => (e.currentTarget.src = "/logo-google.png")}
        alt={he.decode(item.title)}
        unoptimized // because we want to decrease cost of image optimization
      />
    </div>
  )
}

export default memo(ChatMetadataGoogle)
