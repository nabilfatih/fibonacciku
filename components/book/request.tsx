"use client"

import { useState } from "react"
import { IconBookmarkQuestion, IconSend } from "@tabler/icons-react"
import axios from "axios"
import { toast } from "sonner"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function BookRequest() {
  const t = useScopedI18n("ModalBookRequest")
  const { userDetails } = useCurrentUser()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [bookName, setBookName] = useState<string>("")
  const [additionalInfo, setAdditionalInfo] = useState<string>("")

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!userDetails) return
    setIsLoading(true)

    const subject = "Book Request"

    const message = `
        Book Name: ${bookName}
        Additional Info: ${additionalInfo}
    `

    try {
      const res = await axios.post(
        "/api/email/contact",
        {
          email: userDetails.email,
          subject,
          message
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      if (res.status === 200) {
        setBookName("")
        setAdditionalInfo("")
        toast.success(t("request-sent"))
      }
      if (res.status === 400) {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(t("error"))
    }
    setIsLoading(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-background">
            <IconBookmarkQuestion className="mr-2 h-5 w-5" />
            {t("request-book")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("request-book")}</DialogTitle>
            <DialogDescription>{t("request-book-desc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="book-name">{t("book-name")}</Label>
              <Input
                id="book-name"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                placeholder={t("book-name-placeholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additional-info">{t("additional-info")}</Label>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
                placeholder={t("additional-info-placeholder")}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !bookName}
            >
              {isLoading ? (
                <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <IconSend className="mr-2 h-4 w-4" />
              )}{" "}
              {t("request")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="bg-background">
          <IconBookmarkQuestion className="mr-2 h-5 w-5" />
          {t("request-book")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("request-book")}</DrawerTitle>
          <DrawerDescription>{t("request-book-desc")}</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="book-name">{t("book-name")}</Label>
              <Input
                id="book-name"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                placeholder={t("book-name-placeholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additional-info">{t("additional-info")}</Label>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
                placeholder={t("additional-info-placeholder")}
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !bookName}
          >
            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}{" "}
            {t("request")}
          </Button>
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
