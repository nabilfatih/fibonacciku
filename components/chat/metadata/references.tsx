import { memo } from "react"
import { useParams } from "next/navigation"
import { IconBook2, IconFile } from "@tabler/icons-react"

import type { SourceDocument } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"

type Props = {
  metadata: SourceDocument[]
}

function ChatMetadataReferences({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  const { pageRef, dispatch } = useMessage()

  const params = useParams()
  const feature = params.feature as string

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        {feature === "book" ? (
          <IconBook2 className="h-5 w-5" />
        ) : (
          <IconFile className="h-5 w-5" />
        )}
        <p className="font-medium">{t("references")}:</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{t("page")}</span>
        {metadata.map((item, index) => {
          return (
            <Button
              name="page"
              title={`${t("page")} ${item.page_number}`}
              key={index}
              size="sm"
              className="rounded-full"
              onClick={async () => {
                dispatch({
                  type: "SET_INITIAL_PAGE",
                  payload: item.page_number
                })
                dispatch({
                  type: "SET_OPEN_DOCUMENT",
                  payload: true
                })
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for the sheet to open
                const main = pageRef.current
                if (main && typeof main.scrollToIndex === "function") {
                  main.scrollToIndex({
                    index: item.page_number - 1,
                    alignToTop: true
                  })
                }
              }}
            >
              {item.page_number}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ChatMetadataReferences)
