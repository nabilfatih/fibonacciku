import Link from "next/link"
import { IconMail, IconSparkles } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"

type Props = {
  className?: string
}

export default async function MarketingCta({ className }: Props) {
  const t = await getScopedI18n("Home")

  return (
    <section className={cn("border-t py-36", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="space-y-2 text-center">
          <h1 className="mx-auto w-fit max-w-4xl text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-7xl">
            {t("just-ask-anything")}
          </h1>
          <p className="mx-auto max-w-lg text-balance text-sm sm:text-base md:max-w-2xl">
            {t("slogan")}
          </p>
        </div>
        <div className="mt-4 flex flex-row justify-center gap-2">
          <Button asChild>
            <Link href="/chat/assistant">
              <IconSparkles className="mr-1 h-4 w-4" />
              {t("get-started")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <IconMail className="mr-1 h-4 w-4" />
              {t("contact-us")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
