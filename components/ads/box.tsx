"use client"

import Link from "next/link"
import useSWR from "swr"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { generateUUID } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clickAdsAdzedek, getAdsAdzedek } from "@/app/actions/ads"

export default function AdsBox() {
  const {
    userDetails,
    subscription,
    isLoading: isUserLoading
  } = useCurrentUser()
  const { data, isLoading } = useSWR(userDetails?.id || "ads", getAdsAdzedek)

  if (isLoading || isUserLoading || !data || subscription || !userDetails) {
    return null
  }

  if ("error" in data) return null

  const ads = data.data

  const handleClick = async () => {
    // add new tab
    window.open(ads.link, "_blank")
    clickAdsAdzedek(ads.id, generateUUID())
  }

  return (
    <div className="relative">
      <Button asChild variant="link" className="p-0">
        <Link href="/premium">Upgrade to premium to remove ads</Link>
      </Button>
      <Card
        className="cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={handleClick}
      >
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="text-foreground/80">SPONSORED</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-muted-foreground text-sm sm:text-base">
            {ads.text}
          </p>
          <Button variant="link" className="p-0">
            <Link href={ads.link}>{ads.highlight}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
