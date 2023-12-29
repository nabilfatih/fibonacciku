import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/development/tailwind-indicator";
import { Providers } from "@/components/providers";
import { notFound } from "next/navigation";
import { getScopedI18n } from "@/locales/server";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("Metadata");
  return {
    title: {
      template: "%s · FibonacciKu",
      default: t("title"),
    },
    description: t("desc"),
    generator: "FibonacciKu",
    applicationName: "FibonacciKu",
    creator: "Nabil Akbarazzima Fatih",
    keywords: [
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
    ],
    authors: [{ name: "Nabil Akbarazzima Fatih" }],
    publisher: "Nabil Akbarazzima Fatih",
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    metadataBase: new URL("https://www.fibonacciku.com"),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        id: "/id",
        de: "/de",
      },
      types: {
        "application/rss+xml": "https://www.fibonacciku.com/rss",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.fibonacciku.com",
      siteName: "FibonacciKu",
      locale: "en",
      type: "website",
      alternateLocale: ["en", "id", "de"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/logo.png" },
        new URL("/logo.png", "https://www.fibonacciku.com"),
      ],
      shortcut: "/logo.png",
      apple: [
        { url: "/apple-touch-icon.png" },
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "apple-touch-icon",
          url: "/apple-touch-icon.png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("desc"),
      creator: "@fibonacciku",
    },
    category: "Education, Artificial Intelligence",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locales = new Set(["en", "id", "de"]);

  const isValidLocale = locales.has(params.locale);
  if (!isValidLocale) notFound();

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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />

          <Suspense>{children}</Suspense>

          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
