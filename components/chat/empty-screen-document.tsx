import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"
import dynamic from "next/dynamic"
import LibraryForm from "@/components/library/form"

const ChatLibrary = dynamic(() => import("@/components/chat/library"))

export default function EmptyScreenDocument() {
  const t = useScopedI18n("Library")

  const { userDetails } = useCurrentUser()

  return (
    <div>
      <p className="mb-6 leading-normal text-muted-foreground">
        Upload your document and chat with it.
      </p>

      <LibraryForm className="rounded-3xl border shadow-sm" />

      {userDetails && <ChatLibrary userId={userDetails.id} />}
    </div>
  )
}
