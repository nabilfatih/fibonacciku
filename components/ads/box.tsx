"use client"

import Link from "next/link"
import useSWR from "swr"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { generateUUID } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clickAdsAdzedek, getAdsAdzedek } from "@/app/actions/ads"

export default function AdsBox() {
  const { data, isLoading } = useSWR("ads", getAdsAdzedek)
  const {
    userDetails,
    subscription,
    isLoading: isUserLoading
  } = useCurrentUser()

  if (isLoading || isUserLoading || !data || subscription || !userDetails) {
    return null
  }

  if ("error" in data) return null

  const ads = data.data

  const handleClick = () => {
    clickAdsAdzedek(ads.id, generateUUID())
    // add new tab
    window.open(ads.link, "_blank")
  }

  return (
    <section className="mx-auto max-w-xs p-6">
      <Card className="cursor-pointer" onClick={handleClick}>
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="text-foreground/80">SPONSORED</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-muted-foreground">{ads.text}</p>
          <Button variant="link" className="p-0">
            <Link href={ads.link}>{ads.highlight}</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
