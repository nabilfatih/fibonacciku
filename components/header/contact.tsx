"use client"

import { useCallback, useState } from "react"
import { IconSend } from "@tabler/icons-react"
import axios from "axios"
import { toast } from "sonner"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

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
import { Input } from "@/components/ui/input"
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

export default function Contact({ variant, className }: Props) {
  const t = useScopedI18n("ModalContact")

  const { userDetails } = useCurrentUser()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [subject, setSubject] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (!userDetails) return
      setIsLoading(true)

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
          setSubject("")
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
    },
    [message, t, userDetails, subject]
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className={cn(
              variant && buttonVariants({ variant }),
              "flex w-full justify-start",
              className
            )}
          >
            {t("contact")}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("contact")}</DialogTitle>
            <DialogDescription>{t("desc-contact")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="message">{t("subject")}</Label>
              <Input
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={t("subject-placeholder")}
              />
            </div>
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
          {t("contact")}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("contact")}</DrawerTitle>
          <DrawerDescription>{t("desc-contact")}</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="message">{t("subject")}</Label>
              <Input
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={t("subject-placeholder")}
              />
            </div>
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
            <Button variant="outline">{t("close")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
