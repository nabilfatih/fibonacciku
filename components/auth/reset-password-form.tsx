"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const t = useScopedI18n("Auth")
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = React.useState<string>("")
  const [newPassword, setNewPassword] = React.useState<string>("")

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    setIsLoading(true)

    if (confirmPassword !== newPassword) {
      toast.error(t("password-not-match"))
      setIsLoading(false)
      return
    }

    const {
      data: { user },
      error
    } = await supabaseClient.auth.updateUser({
      password: newPassword
    })

    if (error) {
      toast.error(error.message)
    } else {
      if (user) {
        toast.success(t("password-reset-success"))
        router.replace("/auth/login")
      }
    }

    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="new-password">
              {t("new-password")}
            </Label>
            <Input
              type="password"
              name="new-password"
              placeholder={t("new-password-placeholder")}
              title={t("new-password-placeholder")}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              minLength={8}
              required
            />
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="confirm-password">
              {t("confirm-password")}
            </Label>
            <Input
              type="password"
              name="confirm-password"
              placeholder={t("confirm-password-placeholder")}
              title={t("confirm-password-placeholder")}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              minLength={8}
              required
            />
          </div>
          <Button
            disabled={isLoading || !newPassword || !confirmPassword}
            type="submit"
          >
            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  )
}
