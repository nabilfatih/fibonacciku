import dynamic from "next/dynamic"
import Link from "next/link"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { featuresList } from "@/components/chat/empty-screen-assistant"
import LibraryForm from "@/components/library/form"

const ChatLibrary = dynamic(() => import("@/components/chat/library"))

export default function EmptyScreenDocument() {
  const t = useScopedI18n("Feature")

  const { userDetails } = useCurrentUser()

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        Upload your document and chat with it.
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

      <LibraryForm className="rounded-3xl border shadow-sm" />

      {userDetails && <ChatLibrary userId={userDetails.id} />}
    </div>
  )
}
