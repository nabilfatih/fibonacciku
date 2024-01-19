import type { Features } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"

import EmptyScreenAssistant from "@/components/chat/empty-screen-assistant"
import EmptyScreenBook from "@/components/chat/empty-screen-book"
import EmptyScreenDocument from "@/components/chat/empty-screen-document"

type Props = {
  type: Features
}

function EmptyScreenFeatures({ type }: Props) {
  switch (type) {
    case "assistant":
      return <EmptyScreenAssistant />
    case "document":
      return <EmptyScreenDocument />
    case "book":
      return <EmptyScreenBook />
    default:
      return <EmptyScreenAssistant /> // default to assistant screen if type is not recognized
  }
}

export default function EmptyScreen({ type }: Props) {
  const { userDetails } = useCurrentUser()
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
        Hi{` ${userDetails?.full_name ?? ""}`} 👋
      </h1>
      <EmptyScreenFeatures type={type} />
    </div>
  )
}
