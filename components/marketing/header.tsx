import Image from "next/image"
import Link from "next/link"

import { getScopedI18n } from "@/locales/server"

import { IconSeparator } from "@/components/ui/icons"
import HeaderBadge from "@/components/header/badge"
import UserMenu from "@/components/header/user-menu"
import MarketingSidebarMobile from "@/components/marketing/sidebar-mobile"
import ThemeToggle from "@/components/theme/toggle"

export default async function MarketingHeader() {
  const t = await getScopedI18n("Marketing")
  return (
    <header className="sticky top-0 z-50 flex h-16 border-b bg-background backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-4">
        <div className="flex items-center">
          <MarketingSidebarMobile />
          <Link href="/" className="hidden sm:block">
            <Image
              src="/logo-outline.webp"
              alt="FibonacciKu"
              width={24}
              height={24}
              priority
              sizes="24px"
              className="mr-2 rounded-full object-cover shadow"
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
          <Link
            href="/blog"
            className="hidden pr-2 text-sm underline-offset-4 hover:underline sm:inline-flex"
          >
            {t("blog")}
          </Link>

          <Link
            href="/contact"
            className="hidden pr-2 text-sm underline-offset-4 hover:underline sm:inline-flex"
          >
            {t("contact")}
          </Link>

          <ThemeToggle side="bottom" align="end" />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
