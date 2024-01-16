import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"
import {
  IconBook2,
  IconFile,
  IconMessageCircle2,
  IconRocket
} from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EmptyScreenAssistant() {
  const t = useScopedI18n("Feature")

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        Ask me anything, whatever you want to know.
      </p>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {featuresList.map((feature, index) => (
          <Link key={index} passHref href={feature.link}>
            <Card
              className="overflow-hidden"
              style={{
                backgroundImage: feature.backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <CardHeader
                className={cn(
                  "flex-row items-center space-y-0 space-x-2 bg-muted/70 hover:bg-muted/50 transition-colors",
                  feature.title === "assistant" && "bg-muted/60"
                )}
              >
                <feature.icon className="h-5 w-5" />
                <CardTitle className="leading-none">
                  Fibo {t(feature.title as never)}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <div className="grid">
        <h2 className="mb-2 font-medium tracking-tight">
          Explore what you can do with me:
        </h2>

        <Button asChild variant="outline" className="w-fit">
          <Link href="/chat/explore" className="inline-flex items-center">
            <IconRocket className="h-5 w-5 mr-2" />
            Start exploring
          </Link>
        </Button>
      </div>
    </div>
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
