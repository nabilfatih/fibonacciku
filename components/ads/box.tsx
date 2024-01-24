"use client"

import Link from "next/link"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdsAdzedek } from "@/app/actions/ads"

export default function AdsBox() {
  const { data, isLoading } = useSWR("ads", getAdsAdzedek)

  if (isLoading || !data) {
    return null
  }

  if ("error" in data) return null

  const ads = data.data

  return (
    <section className="mx-auto max-w-xs p-6">
      <Card>
        <CardHeader className="pb-3 pt-5">
          <CardTitle>SPONSORED</CardTitle>
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
