import Image from "next/image"
import Link from "next/link"
import {
  IconBrandDiscord,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube,
  IconExternalLink
} from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import { Button } from "@/components/ui/button"
import AuthLanguage from "@/components/auth/language"
import MarketingFooterArt from "@/components/marketing/footer-art"
import ThemeToggle from "@/components/theme/toggle"

export default async function MarketingFooter() {
  const t = await getScopedI18n("MarketingFooter")

  return (
    <footer className="border-t bg-card backdrop-blur-xl">
      <div className="pt-24">
        <div className="mx-auto w-full max-w-7xl shrink-0 space-y-2 px-4 pb-12">
          <div className="relative space-y-6">
            <Link href="/home" className="flex w-fit items-center">
              <Image
                src="/logo-outline.webp"
                alt="FibonacciKu"
                width={28}
                height={28}
                priority
                sizes="28px"
                className="rounded-full object-cover shadow"
              />

              <h1 className="ml-1.5 flex items-center text-2xl font-semibold tracking-tighter">
                FibonacciKu
              </h1>
            </Link>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              <div className="flex gap-2">
                <AuthLanguage align="start" />
                <ThemeToggle />
              </div>
              <div className="flex flex-col">
                <h1 className="mb-1 font-medium tracking-tight">
                  {t("company")}
                </h1>
                <Link
                  href="/blog"
                  className="w-fit tracking-tight underline-offset-4 hover:underline"
                >
                  {t("blog")}
                </Link>
                <Link
                  href="/about"
                  className="w-fit tracking-tight underline-offset-4 hover:underline"
                >
                  {t("about-us")}
                </Link>
                <Link
                  href="/contact"
                  className="w-fit tracking-tight underline-offset-4 hover:underline"
                >
                  {t("contact")}
                </Link>
                <Link
                  href="https://climate.stripe.com/kctMgY"
                  target="_blank"
                  className="inline-flex w-fit items-center tracking-tight underline-offset-4 hover:underline"
                >
                  {t("climate-action")}
                  <IconExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-7xl shrink-0 space-y-2 border-t px-4 pt-2">
          <div className="grid grid-cols-3">
            <div className="col-span-2 grid h-fit pt-2 sm:col-span-1">
              <p className="mb-1 font-medium tracking-tight">
                FibonacciKu © {new Date().getFullYear()}
              </p>
              <Link
                href="/terms-of-use"
                className="w-fit tracking-tight underline-offset-4 hover:underline"
              >
                {t("terms-of-service")}
              </Link>
              <Link
                href="/privacy-policy"
                className="w-fit tracking-tight underline-offset-4 hover:underline"
              >
                {t("privacy-policy")}
              </Link>
            </div>
            <div className="sm:col-span-2">
              <div className="flex flex-wrap items-center">
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
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pt-12">
          <p className="text-balance tracking-tight">
            {t("all-rights-reserved")}. PT. Nakafa Tekno Kreatif.{" "}
            {t("made-with")} <span className="text-accent">❤️</span>
          </p>
        </div>
      </div>

      <MarketingFooterArt />
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
