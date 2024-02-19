"use client"

import { useState, type FormEvent } from "react"
import axios from "axios"
import { toast } from "sonner"

import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MarketingFormContact() {
  const t = useScopedI18n("MarketingContact")

  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      const res = await axios.post(
        "/api/email/contact",
        {
          email: email,
          subject: "Contact Form Submission",
          message
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      if (res.status === 200) {
        setEmail("")
        setMessage("")
        toast.success(t("success"))
      }
      if (res.status === 400) {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(t("error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t("email-placeholder")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t("message-placeholder")}
            rows={5}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <IconSpinner className="mr-2  animate-spin" />}
        {t("submit")}
      </Button>
    </form>
  )
}
