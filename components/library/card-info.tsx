import moment from "moment"

import type { Libraries } from "@/types/types"
import { cn } from "@/lib/utils"
import LibraryCardActions from "@/components/library/card-actions"
import LibraryCardChatButton from "@/components/library/card-chat-button"

type Props = {
  library: Libraries
  className?: string
}

export default function LibraryCardInfo({ library, className }: Props) {
  return (
    <div
      className={cn(
        "hidden max-w-xs flex-none items-center sm:flex",
        className
      )}
    >
      <span className="mr-2 text-xs text-muted-foreground">
        {moment(library.created_at).fromNow()}
      </span>

      <LibraryCardChatButton library={library} />

      <LibraryCardActions className="hidden sm:inline-flex" library={library} />
    </div>
  )
}
