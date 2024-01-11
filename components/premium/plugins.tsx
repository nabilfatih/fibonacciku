import { getScopedI18n } from "@/locales/server";
import {
  IconBooks,
  IconBrandYoutube,
  IconMath,
  IconPhotoHeart,
  IconSitemap,
  IconWind,
  IconWorldWww,
} from "@tabler/icons-react";

export default async function PremiumPlugins() {
  const t = await getScopedI18n("MarketingPricing");

  return (
    <section className="mx-auto max-w-4xl px-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold leading-none tracking-tight">
          Our plugins
        </h2>
      </div>

      <div className="pt-4">
        <div className="flex flex-wrap gap-4">
          {plugins.map((plugin, index) => {
            return (
              <div
                key={index}
                className="flex-grow rounded-xl border px-4 py-2 shadow-sm"
              >
                <div className="relative flex items-center gap-4">
                  <div className="rounded-xl bg-muted p-2">
                    <plugin.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3>{t(plugin.title as never)}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const plugins = [
  {
    icon: IconPhotoHeart,
    title: "image-generation",
    helper: "image-generation-helper",
  },
  {
    icon: IconMath,
    title: "solve-math",
    helper: "solve-math-helper",
  },
  {
    icon: IconWorldWww,
    title: "internet-access",
    helper: "internet-access-helper",
  },
  {
    icon: IconBrandYoutube,
    title: "youtube-videos",
    helper: "youtube-videos-helper",
  },
  {
    icon: IconBooks,
    title: "academic-research",
    helper: "academic-research-helper",
  },
  {
    icon: IconWind,
    title: "weather",
    helper: "weather-helper",
  },
  {
    icon: IconSitemap,
    title: "website-scraping",
    helper: "website-scraping-helper",
  },
] as const;
