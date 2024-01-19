import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import type { Features } from "@/types/types"
import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import ChatMessage from "@/components/chat"

type Props = {
  params: { feature: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getScopedI18n("MarketingProduct")
  const feature = params.feature

  return {
    title: {
      absolute: t(`fibo-${feature}` as never)
    },
    description:
      feature === "assistant"
        ? t("fibo-assistant-assistant")
        : t("fibo-assistant-document"),
    alternates: {
      canonical: `/chat/${feature}`,
      languages: {
        en: `/en/chat/${feature}`,
        id: `/id/chat/${feature}`,
        de: `/de/chat/${feature}`
      }
    }
  }
}

export default async function ChatFeaturePage({ params, searchParams }: Props) {
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect(`/auth/login?next=/chat/${params.feature}`)
  }

  if (params.feature === "book" && !searchParams.collection) {
    redirect("/book")
  }

  return (
    <ChatMessage userId={session.user.id} type={params.feature as Features} />
  )
}
