import { useState } from "react"
import Image from "next/image"
import { IconRefresh, IconTelescope } from "@tabler/icons-react"
import he from "he"
import sanitizeHtml from "sanitize-html"
import useSWRImmutable from "swr/immutable"

import type { NasaAstronomyPictureOfTheDay } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ChatMetadataAstronomyDialog from "@/components/chat/metadata/astronomy-dialog"
import { getAstronomyPictureOfTheDay } from "@/app/actions/external"

export default function EmptyScreenAssistant() {
  const t = useScopedI18n("EmptyScreen")
  const { data, isLoading, mutate } = useSWRImmutable(
    "astronomy-picture-of-the-day",
    () => getAstronomyPictureOfTheDay(3)
  )

  const [open, setOpen] = useState<boolean>(false)
  const [item, setItem] = useState<NasaAstronomyPictureOfTheDay | null>(null)

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        {t("assistant-desc")}
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <IconTelescope className="h-5 w-5" />
            <h2 className="font-medium tracking-tight">
              {t("astronomy-of-the-day")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <IconTelescope className="h-5 w-5" />
            <h2 className="font-medium tracking-tight">
              {t("astronomy-of-the-day")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {data?.data?.map((item, index) => (
              <div
                key={item.title || index}
                className="group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-colors last:hidden hover:bg-muted/50 sm:last:block"
                onClick={() => {
                  setItem(item)
                  setOpen(true)
                }}
              >
                <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 p-2">
                    <p
                      className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
                      title={he.decode(item.title)}
                    >
                      {he.decode(item.title)}
                    </p>

                    <p
                      className="line-clamp-3 whitespace-pre-wrap break-words text-xs text-muted-foreground"
                      title={sanitizeHtml(he.decode(item.explanation), {
                        allowedTags: [],
                        allowedAttributes: {}
                      })}
                    >
                      {sanitizeHtml(he.decode(item.explanation), {
                        allowedTags: [],
                        allowedAttributes: {}
                      })}
                    </p>
                  </div>

                  <div className="relative h-36 w-full border-t sm:h-48">
                    <Image
                      src={item.url}
                      alt={item.title}
                      sizes="100%"
                      fill
                      priority
                      onError={e => (e.currentTarget.src = item.hdurl)}
                      unoptimized // decrease cost of image optimization
                      className="bg-muted/90 object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => mutate()}>
            <IconRefresh className="h-5 w-5" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      )}

      {item && (
        <ChatMetadataAstronomyDialog
          item={item}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  )
}
