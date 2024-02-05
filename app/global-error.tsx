"use client"

import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import "@/styles/globals.css"
import "@/styles/themes.css"

import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useScopedI18n("BackendRouter")

  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <div className="flex min-h-[100dvh] flex-col">
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="relative flex h-[100dvh] overflow-hidden">
              <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center space-y-4 px-4 text-center">
                <h2 className="text-4xl font-bold">{t("something-wrong")}</h2>
                <Button onClick={() => reset()}>{t("try-again")}</Button>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
