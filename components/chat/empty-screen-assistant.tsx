import { useState } from "react"
import Image from "next/image"
import { IconRefresh, IconTelescope } from "@tabler/icons-react"
import { motion } from "framer-motion"
import he from "he"
import sanitizeHtml from "sanitize-html"
import useSWRImmutable from "swr/immutable"

import type { NasaAstronomyPictureOfTheDay } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import ChatMetadataAstronomyDialog from "@/components/chat/metadata/astronomy-dialog"
import { getAstronomyPictureOfTheDay } from "@/app/actions/external"

export default function EmptyScreenAssistant() {
  const t = useScopedI18n("EmptyScreen")
  const { data, mutate, isValidating } = useSWRImmutable(
    "astronomy-picture-of-the-day",
    () => getAstronomyPictureOfTheDay(3)
  )

  const [open, setOpen] = useState<boolean>(false)
  const [item, setItem] = useState<NasaAstronomyPictureOfTheDay | null>(null)

  if (!data) {
    return (
      <div className="space-y-6">
        <p className="leading-normal text-muted-foreground">
          {t("assistant-desc")}
        </p>
      </div>
    )
  }

  const isError = "error" in data

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        {t("assistant-desc")}
      </p>

      {!isError && (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.5
          }}
          viewport={{ amount: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-1">
            <IconTelescope className="h-5 w-5" />
            <h2 className="font-medium tracking-tight">
              {t("astronomy-of-the-day")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {data.data.map((item, index) => (
              <div
                key={item.title || index}
                className="group cursor-pointer overflow-hidden rounded-xl border shadow transition-colors last:hidden hover:bg-muted/50 sm:last:block"
                onClick={() => {
                  setItem(item)
                  setOpen(true)
                }}
              >
                <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 p-2">
                    <h3
                      className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
                      title={he.decode(item.title)}
                    >
                      {he.decode(item.title)}
                    </h3>

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
                      unoptimized // decrease cost of image optimization
                      onError={e =>
                        (e.currentTarget.src = "/fibo-astronomy.webp")
                      }
                      className="bg-muted/90 object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={isValidating}
              onClick={() => mutate()}
            >
              {isValidating ? (
                <IconSpinner className="h-5 w-5 animate-spin" />
              ) : (
                <IconRefresh className="h-5 w-5" />
              )}
              <span className="sr-only">Refresh</span>
            </Button>
            <p className="text-xs leading-none text-muted-foreground">
              {t("powered-by-nasa")}
            </p>
          </div>
        </motion.div>
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
