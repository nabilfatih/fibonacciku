import Image from "next/image"
import Avatar, { genConfig } from "react-nice-avatar"

import { useCurrentUser } from "@/lib/context/use-current-user"

import {
  AvatarFallback,
  AvatarImage,
  Avatar as UiAvatar
} from "@/components/ui/avatar"

type Props = {
  role: string
}

export default function ChatAvatar({ role }: Props) {
  const { userDetails } = useCurrentUser()

  const config = genConfig(
    userDetails?.full_name || userDetails?.email || "Anonymous"
  )

  if (role === "assistant") {
    return (
      <div className="relative h-8 w-8 rounded-full object-cover shadow">
        <Image
          title="FibonacciKu"
          src="/logo.webp"
          fill
          sizes="32px"
          className="rounded-full"
          priority
          alt="FibonacciKu Avatar"
        />
      </div>
    )
  }

  return (
    <>
      {userDetails?.avatar_url ? (
        <UiAvatar className="h-8 w-8 border border-border shadow">
          <AvatarImage
            src={userDetails.avatar_url}
            alt={userDetails.full_name ?? userDetails.email ?? "Avatar"}
          />
          <AvatarFallback className="bg-background text-foreground">
            {userDetails.full_name?.slice(0, 2).toUpperCase() ??
              userDetails.email?.slice(0, 2).toUpperCase() ??
              "AN"}
          </AvatarFallback>
        </UiAvatar>
      ) : (
        <Avatar
          className="h-8 w-8 rounded-full object-cover shadow"
          {...config}
        />
      )}
    </>
  )
}
