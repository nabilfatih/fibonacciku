import Link from "next/link"
import { IconBook2, IconFile, IconMessageCircle2 } from "@tabler/icons-react"

import { useScopedI18n } from "@/locales/client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatFeature() {
  const t = useScopedI18n("Feature")
  return (
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
  )
}

const featuresList = [
  {
    title: "assistant",
    desc: "assistant-desc",
    icon: IconMessageCircle2,
    link: "/chat/assistant",
    backgroundImage: "url(/fibo-assistant.webp)"
  },
  {
    title: "document",
    desc: "document-desc",
    icon: IconFile,
    link: "/chat/document",
    backgroundImage: "url(/fibo-document.webp)"
  },
  {
    title: "book",
    desc: "book-desc",
    icon: IconBook2,
    link: "/book",
    backgroundImage: "url(/fibo-book.webp)"
  }
]
