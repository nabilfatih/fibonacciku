import Image from "next/image"
import Link from "next/link"
import { IconArticle } from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import { IconSeparator } from "@/components/ui/icons"
import HeaderBadge from "@/components/header/badge"
import UserMenu from "@/components/header/user-menu"
import ThemeToggle from "@/components/theme/toggle"

export default async function MarketingHeader() {
  const t = await getScopedI18n("Marketing")
  return (
    <header className="sticky top-0 z-50 flex h-16 border-b bg-muted backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.webp"
              alt="FibonacciKu"
              width={24}
              height={24}
              priority
              sizes="24px"
              className="mr-2 rounded-full border object-cover shadow"
            />
          </Link>
          <h1 className="flex items-center">
            <IconSeparator className="h-6 w-6 text-muted-foreground/50" />

            <Link
              href="/"
              className="ml-2 text-lg font-semibold tracking-tighter"
            >
              FibonacciKu
            </Link>

            <HeaderBadge />
          </h1>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-3">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/blog">{t("blog")}</Link>
          </Button>
          <Button variant="outline" size="icon" asChild className="sm:hidden">
            <Link href="/blog">
              <IconArticle className="h-5 w-5" />
              <span className="sr-only">{t("blog")}</span>
            </Link>
          </Button>
          <ThemeToggle side="bottom" align="end" />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
