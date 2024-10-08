import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { setStaticParamsLocale } from "next-international/server"

import type { Features } from "@/types/types"
import { chatFeatures } from "@/lib/data/chat"
import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import ChatMessage from "@/components/chat"

type Props = {
  params: { locale: string; feature: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getScopedI18n("MarketingProduct")
  const feature = params.feature

  return {
    title: {
      absolute: `Fibo ${t(feature as never)}`
    },
    description: t(`fibo-${feature}-description` as never),
    alternates: {
      languages: {
        en: `/en/chat/${feature}`,
        id: `/id/chat/${feature}`,
        de: `/de/chat/${feature}`,
        ru: `/ru/chat/${feature}`,
        nl: `/nl/chat/${feature}`,
        it: `/it/chat/${feature}`
      }
    }
  }
}

export function generateStaticParams() {
  return chatFeatures.map(feature => ({ feature }))
}

export default async function ChatFeaturePage({ params, searchParams }: Props) {
  setStaticParamsLocale(params.locale)
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
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
    const { data: userDetails } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", user.id)
      .limit(1)
      .maybeSingle()

    if (userDetails) {
      // check if user is in range of 3 minutes
      const now = new Date()
      const createdAt = new Date(userDetails.created_at)
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
        .eq("id", user.id)

      // then remove referral from url
      redirect(`/chat/${params.feature}`)
    }
  }

  return <ChatMessage type={params.feature as Features} />
}
