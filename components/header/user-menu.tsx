"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconBook,
  IconDiscountCheck,
  IconExternalLink,
  IconUser
} from "@tabler/icons-react"
import Avatar, { genConfig } from "react-nice-avatar"

import { useCurrentUser } from "@/lib/context/use-current-user"
import supabaseClient from "@/lib/supabase/client"
import { useScopedI18n } from "@/locales/client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Contact from "@/components/header/contact"
import Feedback from "@/components/header/feedback"

export default function UserMenu() {
  const t = useScopedI18n("ModalAccount")
  const router = useRouter()

  const { userDetails } = useCurrentUser()

  const config = genConfig(
    userDetails?.full_name ?? userDetails?.email ?? "Anonymous"
  )

  if (!userDetails) {
    return (
      <div className="flex items-center justify-between">
        <Avatar
          className="h-8 w-8 rounded-full object-cover shadow-sm transition-opacity duration-300 hover:opacity-80"
          {...config}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div role="button" className="cursor-pointer">
            {userDetails.avatar_url ? (
              <Image
                className="h-8 w-8 min-w-8 select-none rounded-full shadow-sm transition-opacity duration-300 hover:opacity-80"
                src={userDetails.avatar_url}
                alt={userDetails.full_name ?? userDetails.email ?? "Avatar"}
                height={48}
                width={48}
              />
            ) : (
              <Avatar
                className="h-8 w-8 rounded-full object-cover shadow-sm transition-opacity duration-300 hover:opacity-80"
                {...config}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={8}
          align="end"
          className="w-full max-w-[225px]"
        >
          <DropdownMenuLabel className="flex-col items-start py-2">
            <div className="truncate font-medium">
              {userDetails.full_name ?? userDetails.email ?? "Anonymous"}
            </div>
            <div className="truncate font-normal text-muted-foreground">
              {userDetails.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/account"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("account")}
              <IconUser className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/premium"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("premium")}
              <IconDiscountCheck className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/chat/library"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("library")}
              <IconBook className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuLabel
            asChild
            className="cursor-pointer rounded-sm p-0 font-normal transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Feedback className="w-full p-2" />
          </DropdownMenuLabel>

          <DropdownMenuLabel
            asChild
            className="cursor-pointer rounded-sm p-0 font-normal transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Contact className="w-full p-2" />
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem asChild className="py-2">
            <Link
              href="https://blog.fibonacciku.com"
              target="_blank"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("homepage")}
              <IconExternalLink className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await supabaseClient.auth.signOut()
              router.replace("/auth/login")
            }}
            className="cursor-pointer py-2"
          >
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
