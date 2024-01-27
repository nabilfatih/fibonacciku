"use client"

import { useMemo } from "react"
import Link from "next/link"
import useSWRImmutable from "swr/immutable"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { generateUUID } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clickAdsAdzedek, getAdsAdzedek } from "@/app/actions/ads"

type Props = {
  id?: string
}

export default function AdsBox({ id }: Props) {
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
      refreshInterval: 1000 * 60 * 5 // 5 minutes
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
    // add new tab
    window.open(ads.link, "_blank")
  }

  return (
    <div className="relative">
      <Link href={data?.data.link} target="_blank" onClick={handleClick}>
        <Card className="hover:bg-muted/10 transition-colors">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-foreground/80">SPONSORED</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p
              className="text-muted-foreground text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </CardContent>
        </Card>
      </Link>
      <Button asChild variant="link" className="p-0">
        <Link href="/premium">Upgrade to premium to remove ads</Link>
      </Button>
    </div>
  )
}
