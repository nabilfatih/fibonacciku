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
        de: `/de/chat/${feature}`,
        ru: `/ru/chat/${feature}`
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

  // Check if user use referral link
  const referral = searchParams.ref as string | undefined
  if (referral) {
    // first check if user use referral link is in range of 3 minutes of registration
    // to prevent abuse of referral link
    const { data: user } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", session.user.id)
      .limit(1)
      .maybeSingle()

    if (user) {
      // check if user is in range of 3 minutes
      const now = new Date()
      const createdAt = new Date(user.created_at)
      const diff = now.getTime() - createdAt.getTime()
      const diffMinutes = diff / (1000 * 60)

      if (diffMinutes > 3) {
        redirect(`/chat/${params.feature}`)
      }

      // if user is in range of 3 minutes, then add referral to user table
      await supabase
        .from("users")
        .update({
          referral
        })
        .eq("id", session.user.id)

      // then remove referral from url
      redirect(`/chat/${params.feature}`)
    }
  }

  return <ChatMessage type={params.feature as Features} />
}
