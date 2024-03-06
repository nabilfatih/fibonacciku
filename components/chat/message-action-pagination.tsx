import { useCallback, type Dispatch, type SetStateAction } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import type { IndexMessage } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

type Props = {
  currentIndex: IndexMessage
  contentLength: number
}

// Function to update the indexMessage state
const updateIndexMessage = (
  currentIndex: IndexMessage,
  setIndexMessage: Dispatch<SetStateAction<IndexMessage[]>>
) => {
  setIndexMessage((prevIndexMessage: IndexMessage[]) => {
    const updatedIndexMessage = prevIndexMessage.map((item: IndexMessage) =>
      item.index === currentIndex.index ? currentIndex : item
    )
    return updatedIndexMessage
  })
}

export default function ChatMessageActionPagination({
  currentIndex,
  contentLength
}: Props) {
  const t = useScopedI18n("FormChat")
  const { setIndexMessage } = useMessage()

  // Function to decrease the index of current array
  const handlePrevClick = useCallback(() => {
    if (currentIndex.currentMessage) {
      currentIndex.currentMessage -= 1
      updateIndexMessage(currentIndex, setIndexMessage)
    }
  }, [currentIndex, setIndexMessage])

  // Function to increase the index of current array
  const handleNextClick = useCallback(() => {
    if (currentIndex.currentMessage) {
      currentIndex.currentMessage += 1
      updateIndexMessage(currentIndex, setIndexMessage)
    }
  }, [currentIndex, setIndexMessage])

  return (
    <div className="flex items-center space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={currentIndex.currentMessage === 1}
            onClick={handlePrevClick}
          >
            <IconChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous message</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("previous")}</p>
        </TooltipContent>
      </Tooltip>

      <p className="text-sm">
        {currentIndex.currentMessage} / {contentLength}
      </p>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={currentIndex.currentMessage === contentLength}
            onClick={handleNextClick}
          >
            <IconChevronRight className="h-4 w-4" />
            <span className="sr-only">Next message</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("next")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
