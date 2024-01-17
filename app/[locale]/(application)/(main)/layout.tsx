import { SidebarDesktop } from "@/components/sidebar/chat/sidebar-desktop"
import { Suspense } from "react"

export default function ApplicationMainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden">
      <SidebarDesktop />

      <div className="group w-full overflow-hidden pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  )
}
