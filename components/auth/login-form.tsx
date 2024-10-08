"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Provider } from "@supabase/supabase-js"
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  next: string
  referral?: string
}

export default function LoginAuthForm({
  className,
  next,
  referral,
  ...props
}: LoginAuthFormProps) {
  const t = useScopedI18n("Auth")
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()

    setIsLoading(true)

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error(error.message)
      return setIsLoading(false)
    }

    router.refresh()
  }

  const handleOAuthSignIn = async (provider: Provider) => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: next
          ? `https://www.fibonacciku.com/api/auth/callback?next=${next}&ref=${referral}`
          : `https://www.fibonacciku.com/api/auth/callback?ref=${referral}`
      }
    })
    if (error) {
      toast.error(error.message)
    }
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
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("password")}
            </Label>
            <Input
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>
          <Button disabled={isLoading || !email || !password} type="submit">
            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            {t("sign-in")}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or-continue-with")}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => handleOAuthSignIn("google")}
      >
        {isLoading ? (
          <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <IconBrandGoogleFilled className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}
