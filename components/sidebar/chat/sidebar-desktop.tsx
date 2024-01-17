import { Sidebar } from "@/components/sidebar"
import { createClientServer } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { ChatHistory } from "./chat-history"

export async function SidebarDesktop() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory userId={session.user.id} />
    </Sidebar>
  )
}
