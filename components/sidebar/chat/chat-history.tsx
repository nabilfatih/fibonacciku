import NewChat from "@/components/sidebar/chat/new-chat";
import LoadingChatHistory from "@/components/sidebar/chat/loading-chat-history";
import dynamic from "next/dynamic";
import { getScopedI18n } from "@/locales/server";

const SidebarList = dynamic(
  () => import("@/components/sidebar/chat/sidebar-list"),
  {
    loading: () => <LoadingChatHistory />,
  }
);

type ChatHistoryProps = {
  userId: string;
};

export async function ChatHistory({ userId }: ChatHistoryProps) {
  const t = await getScopedI18n("Chat");
  return (
    <div className="flex h-full flex-col">
      <div className="flex px-4 pt-3 lg:hidden">{t("chat-history")}</div>
      <NewChat />
      <SidebarList userId={userId} />
    </div>
  );
}
