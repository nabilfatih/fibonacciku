import {
  IconBook2,
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
    <section className="mx-auto max-w-4xl px-4">
      <div className="grid grid-cols-1 gap-4 gap-y-8 py-4 sm:grid-cols-2 sm:grid-rows-3">
        <div className="flex items-start gap-2">
          <IconSparkles className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              {t("you-can-do-anything")}
            </h2>
            <p className="text-sm text-muted-foreground">
              Unlimited access to all features no matter how much you use fibo.
              No limit, no restriction.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <IconFiles className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Easy upload documents
            </h2>
            <p className="text-sm text-muted-foreground">
              Effortless upload documents to fibo. Just drag and drop. Again, no
              limit.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <IconPuzzle className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Rich plugins
            </h2>
            <p className="text-sm text-muted-foreground">
              Support rich plugins to make your life easier without additional
              cost or configuration.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <IconBook2 className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Books access
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore our books collection. Read it online, download, or chat
              with it.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <IconPhotoScan className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Image analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload your image and ask anything about it. Full integration with
              fibo.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <IconPhotoHeart className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Limitless image generation
            </h2>
            <p className="text-sm text-muted-foreground">
              Let us know your imagination and fibo will generate it for you.
              Powered by DALL-E AI model.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
