"use client"

import { useState } from "react"
import { useScopedI18n } from "@/locales/client"
import { IconSend } from "@tabler/icons-react"
import axios from "axios"
import { toast } from "sonner"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
  className?: string
}

export default function Feedback({ variant, className }: Props) {
  const t = useScopedI18n("ModalFeedback")

  const { userDetails } = useCurrentUser()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [open, setOpen] = useState<boolean>(false)
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
          message
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
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={cn(
              variant && buttonVariants({ variant }),
              "flex w-full justify-start",
              className
            )}
          >
            {t("feedback")}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("feedback")}</DialogTitle>
            <DialogDescription>{t("desc-feedback")}</DialogDescription>
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className={cn(
            variant && buttonVariants({ variant }),
            "flex w-full justify-start",
            className
          )}
        >
          {t("feedback")}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("feedback")}</DrawerTitle>
          <DrawerDescription>{t("desc-feedback")}</DrawerDescription>
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
