import { useScopedI18n } from "@/locales/client"
import type { Libraries } from "@/types/types"
import { IconMessageCirclePlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

type Props = {
  library: Libraries
}

export default function LibraryCardChatButton({ library }: Props) {
  const t = useScopedI18n("Library")
  const router = useRouter()

  const handleChatWithDocument = async (library: Libraries) => {
    if (library.status !== "finished") return
    router.push(`/chat/document?library=${library.id}`)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          disabled={library.status !== "finished"}
          size="icon"
          onClick={() => handleChatWithDocument(library)}
        >
          <IconMessageCirclePlus className="h-5 w-5" />
          <span className="sr-only">{t("chat-with-document")}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("chat-with-document")}</TooltipContent>
    </Tooltip>
  )
}
