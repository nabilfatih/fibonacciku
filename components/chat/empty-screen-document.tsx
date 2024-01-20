import dynamic from "next/dynamic"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"

import LibraryForm from "@/components/library/form"

const ChatLibrary = dynamic(() => import("@/components/chat/library"))

export default function EmptyScreenDocument() {
  const t = useScopedI18n("Feature")

  const { userDetails } = useCurrentUser()

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        Upload your document and chat with it.
      </p>

      <LibraryForm className="rounded-3xl border shadow" />

      {userDetails && <ChatLibrary userId={userDetails.id} />}
    </div>
  )
}
