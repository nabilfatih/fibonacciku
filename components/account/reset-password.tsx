"use client"

import { useState } from "react"
import { useScopedI18n } from "@/locales/client"
import { toast } from "sonner"

import supabaseClient from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"

type Props = {
  email: string
}

export default function AccountResetPassword({ email }: Props) {
  const t = useScopedI18n("ModalAccount")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleResetPassword = async () => {
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
        toast.success(t("reset-password-toast"))
      }
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={handleResetPassword} disabled={isLoading}>
      {isLoading && <IconSpinner className="mr-2 animate-spin" />}
      {t("reset-password")}
    </Button>
  )
}
