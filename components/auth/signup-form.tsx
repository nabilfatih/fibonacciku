"use client"

import * as React from "react"
import type { Provider } from "@supabase/supabase-js"
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"

interface SignupAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  next: string
  referral?: string
}

export default function SignupAuthForm({
  className,
  next,
  referral,
  ...props
}: SignupAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleOAuthSignIn = async (provider: Provider) => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        onClick={() => handleOAuthSignIn("google")}
        variant="outline"
        type="button"
        disabled={isLoading}
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
