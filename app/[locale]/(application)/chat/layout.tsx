import { SidebarDesktop } from "@/components/sidebar/chat/sidebar-desktop";
import { MessageContextProvider } from "@/lib/context/use-message";
import { Suspense } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <SidebarDesktop />

      <div className="group w-full overflow-auto pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        <MessageContextProvider>
          <Suspense>{children}</Suspense>
        </MessageContextProvider>
      </div>
    </div>
  );
}
