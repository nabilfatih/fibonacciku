import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";

import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import { IconSeparator } from "@/components/ui/icons";
import UserMenu from "@/components/header/user-menu";
import { SidebarMobile } from "@/components/sidebar/chat/sidebar-mobile";
import { ChatHistory } from "@/components/sidebar/chat/chat-history";
import HeaderChatFeature from "@/components/header/feature";
import HeaderChatLibrary from "@/components/header/library";

import { createClientServer } from "@/lib/supabase/server";
import HeaderBadge from "@/components/header/badge";
import Image from "next/image";

async function UserHistory() {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex items-center">
      {session?.user?.id ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
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
      )}

      <div className="flex items-center">
        <IconSeparator className="h-6 w-6 text-muted-foreground/50" />

        <Link href="/" className="ml-2 text-lg font-semibold tracking-tighter">
          FibonacciKu
        </Link>

        <HeaderBadge />
      </div>
    </div>
  );
}

export function HeaderChat() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-muted px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserHistory />
        </Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <HeaderChatFeature />
        <HeaderChatLibrary />
        <UserMenu />
      </div>
    </header>
  );
}
