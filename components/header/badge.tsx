"use client"

import Link from "next/link"
import { IconDiscountCheckFilled, IconLockAccess } from "@tabler/icons-react"

import { useCurrentUser } from "@/lib/context/use-current-user"

import { Badge } from "@/components/ui/badge"

export default function HeaderBadge() {
  const { subscription, isLoading } = useCurrentUser()

  if (isLoading) return null

  if (!subscription)
    return (
      <Link href="/premium" className="ml-2">
        <Badge variant="outline" className="hidden sm:inline-flex">
          Limit access
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
