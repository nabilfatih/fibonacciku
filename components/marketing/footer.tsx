import Link from "next/link"
import {
  IconBrandDiscord,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube
} from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"

export default async function MarketingFooter() {
  const t = await getScopedI18n("MarketingFooter")

  return (
    <footer className="border-t bg-muted backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl shrink-0 space-y-2 p-4">
        <div className="flex flex-wrap items-center justify-center">
          {socialMedia.map(social => {
            return (
              <Button
                title={`FibonacciKu ${social.name}`}
                key={social.link}
                variant="ghost"
                size="icon"
                asChild
              >
                <Link
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              </Button>
            )
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <aside>
            <p>
              {t("copyright")} © {new Date().getFullYear()} -{" "}
              {t("all-rights-reserved")}. PT. Nakafa Tekno Kreatif.{" "}
              {t("made-with")} <span className="text-accent">❤️</span>
            </p>
          </aside>
        </div>
      </div>
    </footer>
  )
}

const socialMedia = [
  {
    link: "https://www.youtube.com/@fibonacciku",
    name: "YouTube",
    icon: IconBrandYoutube
  },
  {
    link: "https://www.tiktok.com/@fibonacciku",
    name: "TikTok",
    icon: IconBrandTiktok
  },
  {
    link: "https://www.linkedin.com/company/fibonacciku",
    name: "LinkedIn",
    icon: IconBrandLinkedin
  },
  {
    link: "https://twitter.com/fibonacciku",
    name: "Twitter",
    icon: IconBrandTwitter
  },
  {
    link: "https://www.instagram.com/fibonacciku.id",
    name: "Instagram",
    icon: IconBrandInstagram
  },
  {
    link: "https://discord.gg/zCxAqtMqmc",
    name: "Discord",
    icon: IconBrandDiscord
  }
]
