import { Badge } from "@/components/ui/badge";
import { getScopedI18n } from "@/locales/server";

export default async function PremiumPage() {
  const t = await getScopedI18n("MarketingPricing");
  return (
    <>
      <header className="border-b py-6">
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold tracking-tighter">
              FibonacciKu
            </h1>
            <Badge className="ml-2">Premium</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">{t("desc-2")}</p>
        </div>
      </header>
    </>
  );
}
