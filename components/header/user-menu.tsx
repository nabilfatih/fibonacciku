"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconBook,
  IconDiscountCheck,
  IconExternalLink,
  IconHomeShield,
  IconLogin,
  IconNews,
  IconUser
} from "@tabler/icons-react"
import Avatar, { genConfig } from "react-nice-avatar"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { admin } from "@/lib/data/admin"
import supabaseClient from "@/lib/supabase/client"
import { useScopedI18n } from "@/locales/client"

import {
  AvatarFallback,
  AvatarImage,
  Avatar as UiAvatar
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

  const { userDetails, isLoading, handleClearCurrentUserData } =
    useCurrentUser()

  const config = genConfig(
    userDetails?.full_name ?? userDetails?.email ?? "Anonymous"
  )

  const handleLogout = useCallback(async () => {
    await supabaseClient.auth.signOut()
    router.replace("/auth/login")
    router.refresh()
    handleClearCurrentUserData()
  }, [router, handleClearCurrentUserData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <Avatar
          className="h-9 w-9 rounded-full border object-cover shadow transition-opacity duration-300 hover:opacity-80"
          {...config}
        />
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-between">
        <Button size="icon" asChild className="sm:hidden">
          <Link href="/auth/login">
            <IconLogin className="h-5 w-5" />
          </Link>
        </Button>

        <Button asChild className="hidden sm:inline-flex">
          <Link href="/auth/login">{t("login")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div role="button" className="cursor-pointer">
            {userDetails.avatar_url ? (
              <UiAvatar className="h-9 w-9 border shadow">
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
                className="h-9 w-9 rounded-full border object-cover shadow transition-opacity duration-300 hover:opacity-80"
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
          {admin.has(userDetails.email || "") && (
            <DropdownMenuItem asChild className="py-2">
              <Link
                href="/admin"
                className="inline-flex w-full cursor-pointer items-center justify-between"
              >
                {t("admin")}
                <IconHomeShield className="ml-auto h-4 w-4" />
              </Link>
            </DropdownMenuItem>
          )}
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
              href="/library"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("library")}
              <IconBook className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

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

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/home"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("homepage")}
              <IconExternalLink className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/blog"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("blog")}
              <IconNews className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer py-2"
          >
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
