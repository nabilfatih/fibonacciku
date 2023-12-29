import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import { IconSeparator } from "@/components/ui/icons";
import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";
import UserMenu from "@/components/header/chat/user-menu";
import { SidebarMobile } from "@/components/sidebar/chat/sidebar-mobile";
import { ChatHistory } from "@/components/sidebar/chat/chat-history";
import Feedback from "@/components/header/chat/feedback";
import HeaderChatFeature from "./feature";

async function UserHistory() {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) return null;

  return (
    <div className="flex items-center">
      <SidebarMobile>
        <ChatHistory userId={session.user.id} />
      </SidebarMobile>
      <SidebarToggle />
      <div className="ml-[10px] flex items-center">
        <IconSeparator className="h-6 w-6 text-muted-foreground/50" />

        <HeaderChatFeature />
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
        <div className="hidden sm:flex">
          <Feedback variant="outline" />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
