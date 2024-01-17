"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useScopedI18n } from "@/locales/client"
import type { Provider } from "@supabase/supabase-js"
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"

interface SignupAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  next: string
}

export function SignupAuthForm({
  className,
  next,
  ...props
}: SignupAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleOAuthSignIn = async (provider: Provider) => {
    setIsLoading(true)
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: next
          ? `https://www.fibonacciku.com/api/auth/callback?next=${next}`
          : "https://www.fibonacciku.com/api/auth/callback"
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
