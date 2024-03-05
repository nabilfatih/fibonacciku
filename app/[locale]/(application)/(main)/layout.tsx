import RoleDialog from "@/components/header/role-dialog"
import { SidebarDesktop } from "@/components/sidebar/chat/sidebar-desktop"

export default function ApplicationMainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden">
      <SidebarDesktop />

      <RoleDialog />

      <div className="group w-full overflow-hidden pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        {children}
      </div>
    </div>
  )
}
