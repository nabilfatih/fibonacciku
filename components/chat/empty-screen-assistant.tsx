import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"
import { IconBook2, IconFile, IconMessageCircle2 } from "@tabler/icons-react"
import Link from "next/link"

export default function EmptyScreenAssistant() {
  const t = useScopedI18n("Feature")

  return (
    <div>
      <p className="mb-6 leading-normal text-muted-foreground">
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
