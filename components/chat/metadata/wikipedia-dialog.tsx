import { memo } from "react"
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
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

type Props = {
  item: WikiSearchContentResult

  open: boolean
  setOpen: (open: boolean) => void
}

function ChatMetadataWikipediaDialog({ item, open, setOpen }: Props) {
  const t = useScopedI18n("ModalPluginChat")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
