"use client"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { IconDiscountCheckFilled } from "@tabler/icons-react"

export default function HeaderBadge() {
  const { subscription } = useCurrentUser()

  if (!subscription) return null

  return (
    <div className="ml-2">
      <IconDiscountCheckFilled className="h-4 w-4 text-primary" />
    </div>
  )
}
