"use client"

import { useRouter } from "next/navigation"
import { IconLogout } from "@tabler/icons-react"

import supabaseClient from "@/lib/supabase/client"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"

export default function AccountLogout() {
  const t = useScopedI18n("ModalAccount")
  const router = useRouter()
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await supabaseClient.auth.signOut()
        router.replace("/auth/login")
      }}
    >
      <IconLogout className="mr-2 h-4 w-4" />
      {t("logout")}
    </Button>
  )
}
