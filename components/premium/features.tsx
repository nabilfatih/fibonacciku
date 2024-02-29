import {
  IconCrown,
  IconFiles,
  IconPhotoHeart,
  IconPhotoScan,
  IconPuzzle,
  IconSparkles
} from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

export default async function PremiumFeatures() {
  const t = await getScopedI18n("MarketingPricing")
  return (
    <div className="grid grid-cols-1 gap-4 gap-y-8 py-4 sm:grid-cols-2 sm:grid-rows-3">
      <div className="flex items-start gap-2">
        <IconSparkles className="h-6 w-6 min-w-6" />
        <div className="flex flex-col gap-1 tracking-tight">
          <h2 className="text-lg font-semibold leading-none">
            {t("you-can-do-anything")}
          </h2>
          <p className="text-muted-foreground">
            {t("you-can-do-anything-desc")}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <IconFiles className="h-6 w-6 min-w-6" />
        <div className="flex flex-col gap-1 tracking-tight">
          <h2 className="text-lg font-semibold leading-none">
            {t("unlimited-document-upload")}
          </h2>
          <p className="text-muted-foreground">
            {t("unlimited-document-upload-desc")}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <IconPuzzle className="h-6 w-6 min-w-6" />
        <div className="flex flex-col gap-1 tracking-tight">
          <h2 className="text-lg font-semibold leading-none">
            {t("rich-plugins")}
          </h2>
          <p className="text-muted-foreground">{t("rich-plugins-desc")}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <IconCrown className="h-6 w-6 min-w-6" />
        <div className="flex flex-col gap-1 tracking-tight">
          <h2 className="text-lg font-semibold leading-none">
            {t("priority-access")}
          </h2>
          <p className="text-muted-foreground">{t("priority-access-desc")}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <IconPhotoScan className="h-6 w-6 min-w-6" />
        <div className="flex flex-col gap-1 tracking-tight">
          <h2 className="text-lg font-semibold leading-none">
            {t("image-analysis")}
          </h2>
          <p className="text-muted-foreground">{t("image-analysis-desc")}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <IconPhotoHeart className="h-6 w-6 min-w-6" />
        <div className="flex flex-col gap-1 tracking-tight">
          <h2 className="text-lg font-semibold leading-none">
            {t("limitless-image-generation")}
          </h2>
          <p className="text-muted-foreground">
            {t("limitless-image-generation-desc")}
          </p>
        </div>
      </div>
    </div>
  )
}
