"use client"

import Link from "next/link"
import { IconDiscountCheckFilled, IconLockAccess } from "@tabler/icons-react"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"

import { Badge } from "@/components/ui/badge"

export default function HeaderBadge() {
  const t = useScopedI18n("ModalSubscription")
  const { subscription, userDetails, isLoading } = useCurrentUser()

  if (isLoading || !userDetails) return null

  if (!subscription)
    return (
      <Link href="/premium" className="ml-2">
        <Badge variant="outline" className="hidden sm:inline-flex">
          {t("limit-access")}
        </Badge>
        <IconLockAccess className="h-4 w-4 text-primary sm:hidden" />
      </Link>
    )

  return (
    <Link href="/premium" className="ml-2">
      <IconDiscountCheckFilled className="h-4 w-4 text-primary" />
    </Link>
  )
}
