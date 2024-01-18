import { useMemo } from "react"
import Image from "next/image"
import { IconX } from "@tabler/icons-react"

import { useMessage } from "@/lib/context/use-message"

import { Button } from "@/components/ui/button"

export default function FormAttachment() {
  const { state, dispatch } = useMessage()

  // prevent re-rendering the image
  const url = useMemo(() => {
    if (!state.attachment) return ""
    return URL.createObjectURL(state.attachment)
  }, [state.attachment])

  if (!state.attachment) return null

  return (
    <div className="absolute -top-1 flex items-center sm:px-4">
      <div className="relative">
        <span className="absolute -right-6 -top-4 z-[1]">
          <Button
            name="remove-attachment"
            role="button"
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full p-0"
            onClick={() => dispatch({ type: "SET_ATTACHMENT", payload: null })}
          >
            <IconX className="h-4 w-4" />
            <span className="sr-only">Remove attachment</span>
          </Button>
        </span>
        <div className="relative h-12 w-12 rounded-xl border shadow-sm">
          <Image
            src={url}
            priority
            className="rounded-xl bg-muted/90 object-cover"
            fill
            sizes="48px"
            alt={state.attachment.name || "Attachment"}
          />
        </div>
      </div>
    </div>
  )
}
