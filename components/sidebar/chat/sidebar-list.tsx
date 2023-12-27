"use client";

import { ThemeToggle } from "@/components/theme/toggle";
import useChatHistory from "@/lib/swr/use-chat-history";
import LoadingChatHistory from "./loading-chat-history";
import { useScopedI18n } from "@/locales/client";
import { SidebarItems } from "./sidebar-items";

type Props = {
  userId: string;
};

export default function SidebarList({ userId }: Props) {
  const { userChatHistory, isLoading } = useChatHistory(userId);

  const t = useScopedI18n("Chat");

  if (isLoading) return <LoadingChatHistory />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {userChatHistory?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={userChatHistory} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("chat-not-found")}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <ThemeToggle />
        {/* <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} /> */}
      </div>
    </div>
  );
}
