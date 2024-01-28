import Link from "next/link"

import { getScopedI18n } from "@/locales/server"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default async function AccountSubscriptionEmpty() {
  const t = await getScopedI18n("ModalSubscription")
  return (
    <section className="mx-auto max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("subscription")}</CardTitle>
          <div className="flex flex-row items-center gap-2">
            <CardDescription>{t("plan-summary")}</CardDescription>
            <Badge>{t("free")}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("do-not-have-plan")}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild>
            <Link href="/premium">{t("see-premium")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
