import { useTransition } from "react"
import { toast } from "sonner"

import type { Libraries } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

import { IconSpinner } from "@/components/ui/icons"
import LibraryCardActions from "@/components/library/card-actions"
import { getLibraryFile } from "@/app/actions"

type Props = {
  library: Libraries
}

export default function LibraryCardFilename({ library }: Props) {
  const t = useScopedI18n("Library")

  const [isSeeDocumentPending, startSeeDocumentTransition] = useTransition()

  return (
    <div className="flex items-center justify-between sm:mr-4">
      <div className="flex w-[15rem] flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("filename")}</span>
          {isSeeDocumentPending && <IconSpinner className="animate-spin" />}
        </div>
        <p
          title={library.name}
          className="cursor-pointer truncate text-sm hover:underline"
          onClick={() => {
            startSeeDocumentTransition(async () => {
              const result = await getLibraryFile(library.file_id)

              if (result && "error" in result) {
                toast.error(result.error)
                return
              }

              window.open(result.data, "_blank")
            })
          }}
        >
          {library.name}
        </p>
      </div>

      <LibraryCardActions className="sm:hidden" library={library} />
    </div>
  )
}
