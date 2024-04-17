import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import "@/styles/globals.css"
import "@/styles/config.css"
import "@/styles/themes.css"

import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { localesList } from "@/middleware"
import { Analytics } from "@vercel/analytics/react"

import { themes } from "@/lib/data/themes"
import { cn } from "@/lib/utils"
import { getScopedI18n, getStaticParams } from "@/locales/server"

import Loader from "@/components/ui/loader"
import { Toaster } from "@/components/ui/sonner"
import { TailwindIndicator } from "@/components/development/tailwind-indicator"
import Providers from "@/components/providers"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Metadata")
  return {
    title: {
      template: "%s - FibonacciKu",
      default: t("title")
    },
    description: t("desc"),
    generator: "FibonacciKu",
    applicationName: "FibonacciKu",
    creator: "Nabil Akbarazzima Fatih",
    keywords: [
      ...t("title").split(" "),
      ...t("desc").split(" "),
      ...t("slogan").split(" "),
      ...t("description").split(" "),
      "FibonacciKu",
      "Fibonacci",
      "Artificial Intelligence",
      "AI Learning",
      "AI Tutor",
      "Machine Learning",
      "Data Science",
      "Technology Education",
      "AI Chatbot",
      "Educational Platform",
      "Study Platform",
      "Study Buddy",
      "AI for Education"
    ],
    referrer: "origin-when-cross-origin",
    authors: [{ name: "Nabil Akbarazzima Fatih" }],
    publisher: "Nabil Akbarazzima Fatih",
    formatDetection: {
      telephone: true,
      email: true,
      address: true
    },
    metadataBase: new URL("https://fibonacciku.com"),
    alternates: {
      languages: {
        en: "/en",
        id: "/id",
        de: "/de",
        ru: "/ru",
        nl: "/nl",
        it: "/it"
      },
      types: {
        "application/rss+xml": "https://fibonacciku.com/rss"
      }
    },
    openGraph: {
      title: t("title"),
      description: t("desc"),
      url: "https://fibonacciku.com",
      siteName: "FibonacciKu",
      type: "website",
      locale: "en",
      alternateLocale: localesList,
      images: [
        {
          url: "https://fibonacciku.com/og-facebook.png",
          width: 1200,
          height: 630,
          alt: t("title")
        },
        {
          url: "https://fibonacciku.com/og-linkedin.png",
          width: 1200,
          height: 627,
          alt: t("title")
        },
        {
          url: "https://fibonacciku.com/og-twitter-sm.png",
          width: 1200,
          height: 675,
          alt: t("title")
        },
        {
          url: "https://fibonacciku.com/og-twitter-lg.png",
          width: 4096,
          height: 4096,
          alt: t("title")
        },
        {
          url: "https://fibonacciku.com/og-reddit.png",
          width: 1200,
          height: 1200,
          alt: t("title")
        },
        {
          url: "https://fibonacciku.com/og-pinterest.png",
          width: 1000,
          height: 1500,
          alt: t("title")
        }
      ]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    icons: {
      icon: [
        { url: "/logo-background.png" },
        new URL("/logo-background.png", "https://fibonacciku.com")
      ],
      shortcut: ["/logo-background.png", "/logo.png"],
      apple: [
        { url: "/apple-touch-icon.png" },
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
      ],
      other: [
        {
          rel: "apple-touch-icon",
          url: "/apple-touch-icon.png"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("desc"),
      creator: "@fibonacciku",
      site: "@fibonacciku",
      images: [
        {
          url: "https://fibonacciku.com/og-twitter-sm.png",
          width: 1200,
          height: 675,
          alt: t("title")
        },
        {
          url: "https://fibonacciku.com/og-twitter-lg.png",
          width: 4096,
          height: 4096,
          alt: t("title")
        }
      ]
    },
    category: "Technology, Education, Artificial Intelligence",
    verification: {
      google: "google",
      yandex: "yandex",
      yahoo: "yahoo",
      other: {
        me: ["nabilfatih@fibonacciku.com", "https://fibonacciku.com"]
      }
    }
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  interactiveWidget: "resizes-visual"
}

export function generateStaticParams() {
  return getStaticParams()
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locales = new Set(localesList)

  const isValidLocale = locales.has(params.locale)
  if (!isValidLocale) notFound()

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
        suppressHydrationWarning
      >
        <Providers
          locale={params.locale}
          attribute="class"
          enableSystem
          defaultTheme="system"
          themes={themes}
          disableTransitionOnChange
        >
          <Toaster />
          <Loader>
            <div className="flex min-h-[100dvh] flex-col">{children}</div>
          </Loader>
          <TailwindIndicator />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
