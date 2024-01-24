import {
  IconBooks,
  IconBrandYoutube,
  IconDiscountCheckFilled,
  IconMath,
  IconPhotoHeart,
  IconPuzzle,
  IconSitemap,
  IconWind,
  IconWorldWww
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

type Props = {
  text?: string
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  className?: string
}

export default async function PremiumPlugins({
  text,
  variant,
  className
}: Props) {
  const t = await getScopedI18n("ModalPluginChat")

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={variant ?? "outline"} className={cn(className)}>
          {text ?? <IconPuzzle />}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-muted">
        <SheetHeader>
          <SheetTitle>{t("plugin")}</SheetTitle>
          <SheetDescription className="text-xs sm:text-sm">
            {t("plugin-desc")}
          </SheetDescription>
        </SheetHeader>
        <Sidebar className="flex">
          <div className="relative py-4">
            <section className="grid gap-4">
              {pluginsList.map((plugin, index) => {
                return (
                  <div
                    key={index}
                    className="flex w-full items-start gap-2 group"
                  >
                    <div className="rounded-xl bg-secondary bg-opacity-90 p-1">
                      <plugin.icon className="h-5 w-5 min-w-[1.25rem] text-secondary-foreground" />
                    </div>

                    <div className="flex flex-col leading-none gap-1">
                      <div className="flex flex-row items-center gap-2">
                        <h3
                          title={t(plugin.title as never)}
                          className="line-clamp-1 truncate font-semibold leading-none"
                        >
                          {t(plugin.title as never)}
                        </h3>
                        {plugin.premium && (
                          <div title={`Fibo ${t("premium")}`}>
                            <IconDiscountCheckFilled className="inline-block h-5 w-5 min-w-[1.25rem] text-primary" />
                          </div>
                        )}
                      </div>

                      <p
                        title={t(plugin.helper as never)}
                        className="line-clamp-1 text-xs italic text-muted-foreground"
                      >
                        {t(plugin.helper as never)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </section>
          </div>
        </Sidebar>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const pluginsList = [
  {
    icon: IconPhotoHeart,
    title: "image-generation",
    helper: "image-generation-helper",
    premium: true
  },
  {
    icon: IconMath,
    title: "solve-math",
    helper: "solve-math-helper",
    premium: false
  },
  {
    icon: IconWorldWww,
    title: "internet-access",
    helper: "internet-access-helper",
    premium: false
  },
  {
    icon: IconBrandYoutube,
    title: "youtube-videos",
    helper: "youtube-videos-helper",
    premium: false
  },
  {
    icon: IconBooks,
    title: "academic-research",
    helper: "academic-research-helper",
    premium: false
  },
  {
    icon: IconWind,
    title: "weather",
    helper: "weather-helper",
    premium: false
  },
  {
    icon: IconSitemap,
    title: "website-scraping",
    helper: "website-scraping-helper",
    premium: false
  }
] as const
