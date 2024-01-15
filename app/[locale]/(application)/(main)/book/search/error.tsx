"use client" // Error components must be Client Components

import { Button } from "@/components/ui/button"
import { useScopedI18n } from "@/locales/client"
import Link from "next/link"

// This happen when function timeout

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useScopedI18n("BackendRouter")

  return (
    <main className="h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
          {t("high-traffic")}
        </h1>

        <div>
          <p className="mb-6 leading-normal text-muted-foreground">
            {t("something-wrong")}
          </p>

          <Button asChild onClick={() => reset()}>
            <Link href="/book">{t("try-again")}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
