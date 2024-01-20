"use client"

import Link from "next/link"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { featuresList } from "@/components/chat/empty-screen-assistant"

type Props = {
  children: React.ReactNode
}

export default function BookEmptyScreen({ children }: Props) {
  const t = useScopedI18n("Book")
  const tFeature = useScopedI18n("Feature")
  const { userDetails } = useCurrentUser()
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
        Hi{` ${userDetails?.full_name ?? ""}`} 👋
      </h1>

      <div className="space-y-6">
        <p className="leading-normal text-muted-foreground">
          {t("desc-search")}
        </p>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuresList.map((feature, index) => (
            <Link key={index} passHref href={feature.link}>
              <Card className="overflow-hidden">
                <CardHeader className="flex-row items-center space-x-2 space-y-0 bg-muted transition-colors hover:bg-muted/80">
                  <feature.icon className="h-5 w-5" />
                  <CardTitle className="leading-none">
                    Fibo {t(feature.title as never)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>

        {children}
      </div>
    </div>
  )
}
