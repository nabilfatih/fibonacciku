import { memo } from "react"
import { IconCheck, IconSitemap } from "@tabler/icons-react"

import type { WebsiteScraping } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

import { Badge } from "@/components/ui/badge"

type Props = {
  metadata: WebsiteScraping[]
}

function ChatMetadataWebsiteScraping({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconSitemap className="h-5 w-5" />
        <p className="font-medium">{t("website-scraping")}:</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {metadata.map((web, index) => {
          return (
            <Badge key={index} className="w-fit">
              {web.url}
              <IconCheck className="ml-1 h-4 w-4" />
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ChatMetadataWebsiteScraping)
