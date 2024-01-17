import { useCurrentUser } from "@/lib/context/use-current-user"
import { cn, generateNanoID } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"
import { IconFileUpload } from "@tabler/icons-react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { IconSpinner } from "@/components/ui/icons"
import {
  deleteChatDocument,
  uploadChatDocument
} from "@/lib/supabase/client/chat"
import axios from "axios"
import { useRouter } from "next/navigation"
import useUserLibrary from "@/lib/swr/use-user-library"

interface LibraryFormProps extends React.ComponentProps<"button"> {}

export default function LibraryForm({ className, ...props }: LibraryFormProps) {
  const t = useScopedI18n("Library")

  const router = useRouter()

  const { userDetails } = useCurrentUser()
  const { mutate } = useUserLibrary(userDetails?.id || "")

  const inputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isUploadPending, setIsUploadPending] = useState(false)

  const handleDragOver = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
    },
    []
  )

  const handleDragEnter = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
    },
    []
  )

  const handleDragLeave = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(false)
    },
    []
  )

  const handleUploadChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!userDetails) return
      const { files } = e.target

      if (!files || files.length === 0) return

      // only allow one file
      if (files.length > 1) {
        toast.error(t("only-one-document"))
        return
      }

      const file = files[0]

      if (!file) {
        toast.error(t("no-file-selected"))
        return
      }

      if (file.type !== "application/pdf") {
        toast.error(t("invalid-document"))
        return
      }

      if (file.size > 30 * 1024 * 1024) {
        toast.error(t("max-file-size-30mb"))
        return
      }

      const fileId = generateNanoID()

      setIsUploadPending(true)

      try {
        await uploadChatDocument(file, userDetails.id, fileId)

        await axios.post("/api/ai/document/upload", {
          fileId,
          fileName: file.name,
          fileType: file.type
        })

        toast.success(t("upload-success"))
        mutate()
        router.refresh()
      } catch (error) {
        toast.error(t("invalid-document"))
        await deleteChatDocument(userDetails.id, fileId) // delete the file if it's invalid
      } finally {
        setIsUploadPending(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userDetails]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(false)

      const { files } = e.dataTransfer

      await handleUploadChange({
        target: {
          files
        }
      } as any)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUploadChange]
  )

  return (
    <form>
      <button
        type="button"
        role="button"
        aria-label={t("drag-drop-document")}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex max-h-60 w-full grow cursor-pointer flex-col overflow-hidden bg-background px-8 py-4 sm:rounded-3xl sm:border sm:px-12 sm:py-8",
          className
        )}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          multiple={false}
          onChange={handleUploadChange}
        />

        <div className="pointer-events-none flex w-full flex-col items-center gap-2 text-center transition ease-in-out">
          {isUploadPending ? (
            <IconSpinner className="h-8 w-8 animate-spin" />
          ) : (
            <div className={cn(isDragging && "animate-bounce")}>
              <IconFileUpload className="h-8 w-8" />
            </div>
          )}
          <span>{t("drag-drop-document")}</span>
        </div>
      </button>
    </form>
  )
}
