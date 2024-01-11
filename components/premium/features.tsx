import { getScopedI18n } from "@/locales/server";
import {
  IconBook2,
  IconFiles,
  IconPuzzle,
  IconSparkles,
} from "@tabler/icons-react";

export default async function PremiumFeatures() {
  const t = await getScopedI18n("MarketingPricing");
  return (
    <section className="mx-auto max-w-4xl px-4">
      <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-y-6">
        <div className="flex items-start gap-2">
          <IconSparkles className="h-6 w-6 min-w-6" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              {t("you-can-do-anything")}
            </h2>
            <p className="text-sm text-muted-foreground">
              Unlimited access to all features no matter how much you use our
              service. No limit, no restriction.
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
              Effortless upload documents to our service. Just drag and drop.
              Again, no limit.
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
      </div>
    </section>
  );
}
