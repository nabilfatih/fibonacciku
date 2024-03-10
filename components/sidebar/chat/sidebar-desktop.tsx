import { cookies } from "next/headers"

import { createClientServer } from "@/lib/supabase/server"

import Sidebar from "@/components/sidebar"
import { ChatHistory } from "@/components/sidebar/chat/chat-history"

export async function SidebarDesktop() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory />
    </Sidebar>
  )
}
