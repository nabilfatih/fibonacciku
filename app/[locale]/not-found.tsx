import { cookies } from "next/headers"
import Link from "next/link"

import { CurrentUserContextProvider } from "@/lib/context/use-current-user"
import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import HeaderChat from "@/components/header"

export default async function NotFound() {
  const t = await getScopedI18n("BackendRouter")
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <CurrentUserContextProvider user={user}>
      <HeaderChat />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden">
          <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center space-y-4 px-4 text-center">
            <h2 className="text-4xl font-bold">404: {t("not-found")}</h2>
            <p>{t("resource-not-found")}</p>
            <Button asChild>
              <Link href="/">{t("return-home")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </CurrentUserContextProvider>
  )
}
