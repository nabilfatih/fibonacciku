import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function BookAdminPage() {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?next=/book/admin")

  // Only Nabil can access this page
  if (user.id !== "b64ed057-14f7-4968-a4b1-b0ca6ffbe641") redirect("/book")

  return (
    <main className={cn("h-full overflow-y-auto overflow-x-hidden pb-10")}>
      <header className="border-b py-4">
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-semibold">Add book admin</h2>
        </div>
      </header>
    </main>
  )
}
