"use client"

import * as React from "react"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ForgotPasswordFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const t = useScopedI18n("Auth")

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    setIsLoading(true)

    const { error, data } = await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "https://www.fibonacciku.com/auth/reset-password"
      }
    )

    if (error) {
      toast.error(error.message)
    } else {
      if (data) {
        toast.success(t("check-email"))
      }
    }

    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("email")}
            </Label>
            <Input
              id="email"
              placeholder="name@domain.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </div>
          <Button disabled={isLoading || !email} type="submit">
            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  )
}
