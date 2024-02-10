"use client"

import { useMemo } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import useSWRImmutable from "swr/immutable"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { generateUUID } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clickAdsAdzedek, getAdsAdzedek } from "@/app/actions/ads"

type Props = {
  id?: string
}

export default function AdsBox({ id }: Props) {
  const t = useScopedI18n("Ads")

  const {
    userDetails,
    subscription,
    isLoading: isUserLoading
  } = useCurrentUser()

  const { data, isLoading } = useSWRImmutable(
    id || userDetails?.id || "ads",
    getAdsAdzedek,
    {
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
      refreshInterval: 1000 * 60 * 10 // 10 minutes
    }
  )

  const text = useMemo(() => {
    const ads = data?.data
    if (!ads) return ""

    const highlightedText = ads.text
    if (!highlightedText || !ads.highlight) return highlightedText

    const escapedHighlight = ads.highlight.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )
    const regex = new RegExp(escapedHighlight, "gi")

    const replacedText = highlightedText.replace(regex, (match: string) => {
      return `<a href="${ads.link}" target="_blank" class="text-primary underline underline-offset-4">${match}</a>`
    })

    return replacedText
  }, [data?.data])

  if (isLoading || isUserLoading || !data || subscription || !userDetails) {
    return null
  }

  if ("error" in data) return null

  const handleClick = async () => {
    const ads = data?.data
    await clickAdsAdzedek(ads.id, generateUUID())
  }

  return (
    <AnimatePresence>
      <motion.div
        key={data?.data.id || "ads"}
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0 }
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          ease: "easeInOut",
          duration: 0.5
        }}
        viewport={{ amount: 0 }}
        className="relative"
      >
        <Link href={data?.data.link} target="_blank" onClick={handleClick}>
          <Card className="transition-colors hover:bg-muted/10">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="uppercase text-foreground/80">
                {t("sponsored")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p
                className="text-sm text-muted-foreground sm:text-base"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </CardContent>
          </Card>
        </Link>
        <Button asChild variant="link" className="p-0">
          <Link href="/premium">{t("upgrade-to-premium")}</Link>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
