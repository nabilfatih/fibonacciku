import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import logoOutline from "@/public/logo-outline.webp"

import { createClientServer } from "@/lib/supabase/server"

import { IconSeparator } from "@/components/ui/icons"
import HeaderBadge from "@/components/header/badge"
import HeaderChatFeature from "@/components/header/feature"
import UserMenu from "@/components/header/user-menu"
import PremiumPlugins from "@/components/premium/plugins"
import { ChatHistory } from "@/components/sidebar/chat/chat-history"
import { SidebarMobile } from "@/components/sidebar/chat/sidebar-mobile"
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle"

async function UserHistory() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <div className="flex items-center">
      {user?.id ? (
        <>
          <SidebarMobile>
            <ChatHistory />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/">
          <Image
            src={logoOutline}
            alt="FibonacciKu"
            width={24}
            height={24}
            priority
            sizes="24px"
            className="mr-2 rounded-full object-cover shadow"
          />
        </Link>
      )}

      <h1 className="flex items-center">
        <IconSeparator className="h-6 w-6 text-muted-foreground/50" />

        <Link href="/" className="ml-2 text-lg font-semibold tracking-tighter">
          FibonacciKu
        </Link>

        <HeaderBadge />
      </h1>
    </div>
  )
}

export function HeaderChat() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-muted px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <UserHistory />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <HeaderChatFeature />
        <PremiumPlugins variant="ghost" className="-ml-2 flex h-9 w-9 p-0" />
        <UserMenu />
      </div>
    </header>
  )
}
