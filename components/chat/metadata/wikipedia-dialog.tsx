import { memo, useState } from "react"
import Image from "next/image"
import he from "he"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import type { WikiSearchContentResult } from "@/lib/openai/plugin/wiki"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"

type Props = {
  item: WikiSearchContentResult
}

function ChatMetadataWikipediaDialog({ item }: Props) {
  const t = useScopedI18n("ModalPluginChat")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [open, setOpen] = useState<boolean>(false)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-colors hover:bg-muted/50">
            <div className="flex h-full w-full flex-col items-start justify-between gap-3">
              <div className="flex flex-col gap-1 p-2">
                <p
                  className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-medium"
                  title={he.decode(item.title)}
                >
                  {he.decode(item.title)}
                </p>

                <p
                  className="line-clamp-3 whitespace-pre-wrap break-all text-xs first-letter:uppercase"
                  title={he.decode(item.description)}
                >
                  {he.decode(item.description)}
                </p>
              </div>

              <div className="relative h-48 w-full border-t">
                <Image
                  src={item.thumbnail.url || "/fibo-assistant.webp"}
                  alt={item.title}
                  sizes="100%"
                  fill
                  className="bg-muted/90 object-cover"
                />
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription className="first-letter:uppercase">
              {item.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 text-sm">
            <p className="first-letter:uppercase">{he.decode(item.excerpt)}</p>
            {item.thumbnail.url && (
              <Image
                src={item.thumbnail.url}
                alt={item.title}
                sizes="100%"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "28rem"
                }}
                priority
                width={256}
                height={256}
                unoptimized // decrease cost of image optimization
                className="m-0 rounded-xl border bg-muted/90 object-cover shadow-sm"
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>{t("close")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-colors hover:bg-muted/50">
          <div className="flex h-full w-full flex-col items-start justify-between gap-3">
            <div className="flex flex-col gap-1 p-2">
              <p
                className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-medium"
                title={he.decode(item.title)}
              >
                {he.decode(item.title)}
              </p>

              <p
                className="line-clamp-3 whitespace-pre-wrap break-all text-xs first-letter:uppercase"
                title={he.decode(item.description)}
              >
                {he.decode(item.description)}
              </p>
            </div>

            <div className="relative h-36 w-full border-t">
              <Image
                src={item.thumbnail.url || "/fibo-assistant.webp"}
                alt={item.title}
                sizes="100%"
                fill
                className="bg-muted/90 object-cover"
              />
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{item.title}</DrawerTitle>
          <DrawerDescription className="first-letter:uppercase">
            {item.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <p className="text-sm first-letter:uppercase">
            {he.decode(item.excerpt)}
          </p>
          {item.thumbnail.url && (
            <Image
              src={item.thumbnail.url}
              alt={item.title}
              sizes="100%"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "20rem"
              }}
              priority
              width={320}
              height={320}
              unoptimized // decrease cost of image optimization
              className="m-0 rounded-xl border bg-muted/90 object-cover shadow-sm"
            />
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>{t("close")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default memo(ChatMetadataWikipediaDialog)
