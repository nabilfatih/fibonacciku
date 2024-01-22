"use client"

import { useState } from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { IconSend } from "@tabler/icons-react"
import axios from "axios"
import { toast } from "sonner"

import type { Books } from "@/types/types"
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
import { IconSpinner } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BookReportDialogProps extends DialogProps {
  book: Books
  onReport: () => void
}

export default function BookReportDialog({
  book,
  onReport,
  ...props
}: BookReportDialogProps) {
  const t = useScopedI18n("ModalFeedback")
  const tBook = useScopedI18n("BookChat")
  const { userDetails } = useCurrentUser()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!userDetails) return
    setIsLoading(true)

    try {
      const res = await axios.post(
        "/api/email/contact",
        {
          email: userDetails.email,
          subject: "Feedback Form",
          message: `Book Information: 
            \n\nBook ID: ${book.id}
            \n\nBook Title: ${book.title}
            \n\nBook Public ID: ${book.public_id}
            \n\nBook Status: ${book.status}
  
            \n\nMessage from user: ${message}`
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      if (res.status === 200) {
        setMessage("")
        toast.success(t("message-send"))
        onReport()
      }
      if (res.status === 400) {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(t("something-wrong"))
    }
    setIsLoading(false)
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tBook("report")}</DialogTitle>
            <DialogDescription>{tBook("report-desc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t("message-placeholder")}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !message}
            >
              {isLoading ? (
                <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <IconSend className="mr-2 h-4 w-4" />
              )}{" "}
              {t("send")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{tBook("report")}</DrawerTitle>
          <DrawerDescription>{tBook("report-desc")}</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t("message-placeholder")}
              rows={3}
            />
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !message}
          >
            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}{" "}
            {t("send")}
          </Button>
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
