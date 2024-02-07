import Image from "next/image"
import Link from "next/link"

import { IconSeparator } from "@/components/ui/icons"
import HeaderBadge from "@/components/header/badge"
import UserMenu from "@/components/header/user-menu"
import { ThemeToggle } from "@/components/theme/toggle"

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-muted px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="FibonacciKu"
            width={24}
            height={24}
            priority
            className="mr-2 rounded-full object-cover shadow-sm"
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
        <ThemeToggle side="bottom" align="end" />
        <UserMenu />
      </div>
    </header>
  )
}
