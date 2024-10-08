import dynamic from "next/dynamic"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"

import LibraryForm from "@/components/library/form"

const ChatLibrary = dynamic(() => import("@/components/chat/library"))

export default function EmptyScreenDocument() {
  const t = useScopedI18n("EmptyScreen")

  const { userDetails } = useCurrentUser()

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        {t("document-desc")}
      </p>

      <LibraryForm className="rounded-3xl border shadow-sm" />

      {userDetails && <ChatLibrary userId={userDetails.id} />}
    </div>
  )
}
