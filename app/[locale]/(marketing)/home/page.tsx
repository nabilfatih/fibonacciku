import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  IconBooks,
  IconBrandWikipedia,
  IconBrandYoutube,
  IconMail,
  IconMath,
  IconPhoto,
  IconSitemap,
  IconSparkles,
  IconWind,
  IconWorldWww
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { getScopedI18n } from "@/locales/server"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Button } from "@/components/ui/button"
import Particles from "@/components/ui/particles"
import MarketingTransition from "@/components/marketing/transition"
import { pluginsList } from "@/components/premium/plugins"

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/home",
      languages: {
        en: "/en/home",
        id: "/id/home",
        de: "/de/home",
        ru: "/ru/home"
      }
    }
  }
}

export default async function HomePage() {
  const t = await getScopedI18n("Home")

  return (
    <MarketingTransition className="relative">
      <Particles
        className="pointer-events-none absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />

      <section className="px-4 py-36">
        <div className="mx-auto max-w-7xl">
          <header className="text-center">
            <h1 className="mx-auto mb-4 w-fit max-w-4xl text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text pb-4 text-6xl font-bold tracking-tighter text-transparent sm:text-9xl">
              {t("slogan")}
            </h1>
            <p className="mx-auto max-w-lg text-balance text-lg sm:text-xl md:max-w-2xl">
              {t("header-desc-1")}
            </p>
          </header>

          <div className="mt-4 flex flex-row justify-center gap-2">
            <Button asChild>
              <Link href="/chat/assistant">
                <IconSparkles className="mr-1 h-4 w-4" />
                {t("get-started")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                <IconMail className="mr-1 h-4 w-4" />
                {t("contact-us")}
              </Link>
            </Button>
          </div>

          <div className="space-y-4 pt-12 text-center">
            <p className="mx-auto max-w-xs text-balance text-sm">
              {t("slogan-1")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 px-16">
              {pluginsList.map((plugin, index) => {
                return (
                  <div key={index} className="rounded-xl bg-muted p-2">
                    <plugin.icon className="h-5 w-5" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-36">
        <div className="mx-auto max-w-7xl space-y-12">
          <header className="relative space-y-2">
            <h1 className="text-4xl font-semibold tracking-tighter">
              {t("just-ask-anything")}
            </h1>
            <p className="text-muted-foreground">
              {t("just-ask-anything-desc")}
            </p>
          </header>

          <BentoGrid>
            {featuresList.map((feature, index) => (
              <BentoGridItem
                key={index}
                title={t(feature.title as never)}
                description={t(feature.description as never)}
                header={feature.header}
                className={cn("[&>p:text-lg]", feature.className)}
                icon={feature.icon}
              />
            ))}
          </BentoGrid>

          <div className="mx-auto flex w-fit flex-col items-center justify-center">
            <p className="italic">{t("and-more")}...</p>
          </div>
        </div>
      </section>

      <section className="border-t px-4 py-36">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-2 text-center">
            <h1 className="mx-auto w-fit max-w-4xl text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-7xl">
              {t("just-ask-anything")}
            </h1>
            <p className="mx-auto max-w-lg text-balance text-sm sm:text-base md:max-w-2xl">
              {t("slogan")}
            </p>
          </div>
          <div className="mt-4 flex flex-row justify-center gap-2">
            <Button asChild>
              <Link href="/chat/assistant">
                <IconSparkles className="mr-1 h-4 w-4" />
                {t("get-started")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                <IconMail className="mr-1 h-4 w-4" />
                {t("contact-us")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingTransition>
  )
}

const featuresList = [
  {
    header: (
      <div className="relative h-44 w-full overflow-hidden md:h-full">
        <Image
          src="/background-service.webp"
          alt="Image generation"
          sizes="100%"
          fill
          priority
          className="rounded-md border object-cover"
        />
      </div>
    ),
    title: "image-generation",
    description: "image-generation-desc",
    icon: <IconPhoto className="h-6 w-6" />,
    className: "md:col-span-1"
  },
  {
    header: (
      <div className="grid h-full space-y-2">
        <Link
          href="/"
          title="FibonacciKu"
          className="group min-h-[82px] rounded-md border bg-card p-2 transition-colors hover:bg-card/50"
        >
          <div className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden">
            <div className="flex flex-col gap-1">
              <p
                className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
                title="FibonacciKu"
              >
                Genius Study Buddy
              </p>

              <p className="line-clamp-2 whitespace-pre-wrap break-words text-xs">
                Start using AI for your personal tutor instead of cheating tool.
                Specifically designed for teachers and students.
              </p>
            </div>

            <div className="flex flex-row items-center gap-1">
              <div
                className="relative overflow-hidden"
                style={{ minWidth: "16px" }}
              >
                <Image
                  className="m-0 block rounded-full bg-transparent object-contain"
                  src="/logo-outline.webp"
                  sizes="16px"
                  width={16}
                  height={16}
                  alt="FibonacciKu"
                />
              </div>

              <span className="line-clamp-1 text-xs text-muted-foreground">
                fibonacciku
              </span>
            </div>
          </div>
        </Link>
        <Link
          target="_blank"
          href="https://www.youtube.com/@fibonacciku"
          title="FibonacciKu Indonesia"
          className="group min-h-[82px] rounded-md border bg-card p-2 transition-colors hover:bg-card/50"
        >
          <div className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden">
            <div className="flex flex-col gap-1">
              <p
                className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
                title="FibonacciKu"
              >
                E-Learning Indonesia
              </p>

              <p className="line-clamp-2 whitespace-pre-wrap break-words text-xs">
                Easy to understand and fun to learn. We are here for better
                education in Indonesia.
              </p>
            </div>

            <div className="flex flex-row items-center gap-1">
              <div
                className="relative overflow-hidden"
                style={{ minWidth: "16px" }}
              >
                <Image
                  className="m-0 block rounded-full bg-transparent object-contain"
                  src="/logo-youtube.png"
                  sizes="16px"
                  width={16}
                  height={16}
                  alt="FibonacciKu Indonesia"
                />
              </div>

              <span className="line-clamp-1 text-xs text-muted-foreground">
                fibonacciku indonesia
              </span>
            </div>
          </div>
        </Link>
      </div>
    ),
    title: "internet-access",
    description: "internet-access-desc",
    icon: <IconWorldWww className="h-6 w-6" />,
    className: "md:col-span-1"
  },
  {
    header: (
      <Link
        title="Everything You Need to Know About Planet Earth"
        rel="noopener noreferrer"
        href="https://www.youtube.com/watch?v=JGXi_9A__Vc"
        target="_blank"
        className="group h-full min-h-[82px] rounded-md border p-2 transition-colors hover:bg-card/50"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 20, 39, 0.7), rgba(10, 20, 39, 0.7)), url(https://i.ytimg.com/vi/JGXi_9A__Vc/hqdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="flex h-full w-full flex-col items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p
              className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium text-zinc-100"
              title="Everything You Need to Know About Planet Earth"
            >
              Everything You Need to Know About Planet Earth
            </p>

            <p
              className="line-clamp-3 whitespace-pre-wrap break-words text-xs text-zinc-100/80"
              title="Planet Earth is this solid thing you are standing on right now. In your everyday life you don&#39;t really waste a thought about how ..."
            >
              Planet Earth is this solid thing you are standing on right now. In
              your everyday life you don&#39;t really waste a thought about how
              ...
            </p>
          </div>

          <div className="flex flex-row items-center gap-1">
            <div
              className="relative overflow-hidden"
              style={{ minWidth: "16px" }}
            >
              <Image
                title="Kurzgesagt – In a Nutshell"
                className="m-0 block rounded-full bg-transparent object-contain"
                src="/logo-youtube.png"
                width={16}
                height={16}
                alt="Kurzgesagt – In a Nutshell"
              />
            </div>

            <span className="line-clamp-1 text-xs text-zinc-100">
              Kurzgesagt – In a Nutshell
            </span>
          </div>
        </div>
      </Link>
    ),
    title: "youtube-videos",
    description: "youtube-videos-desc",
    icon: <IconBrandYoutube className="h-6 w-6" />,
    className: "md:col-span-1"
  },
  {
    header: (
      <div className="grid h-full grid-cols-1 space-y-2 md:grid-cols-2 md:space-x-2 md:space-y-0">
        <Link
          title="Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms"
          rel="noopener noreferrer"
          href="https://www.semanticscholar.org/paper/f9c602cc436a9ea2f9e7db48c77d924e09ce3c32"
          target="_blank"
          className="group min-h-[82px] rounded-md border bg-card p-2 transition-colors hover:bg-card/50"
        >
          <div className="flex h-full w-full flex-col items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p
                className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-semibold"
                title="Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms"
              >
                Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine
                Learning Algorithms
              </p>

              <p
                className="line-clamp-3 whitespace-pre-wrap break-words text-xs"
                title="Fashion-MNIST is intended to serve as a direct drop-in replacement for the original MNIST dataset for benchmarking machine learning algorithms, as it shares the same image size, data format and the structure of training and testing splits."
              >
                Fashion-MNIST is intended to serve as a direct drop-in
                replacement for the original MNIST dataset for benchmarking
                machine learning algorithms, as it shares the same image size,
                data format and the structure of training and testing splits.
              </p>
            </div>

            <div className="flex flex-row items-center gap-1">
              <div
                className="relative overflow-hidden"
                style={{ minWidth: "16px" }}
              >
                <Image
                  title="Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms"
                  className="m-0 block rounded-full bg-transparent object-contain"
                  src="/semantic_logo.webp"
                  width={16}
                  height={16}
                  style={{
                    width: "16px",
                    height: "auto"
                  }}
                  alt="Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms"
                />
              </div>

              <span className="line-clamp-1 text-xs text-muted-foreground">
                Han Xiao, Kashif Rasul, Roland Vollgraf
              </span>
            </div>
          </div>
        </Link>
        <Link
          title="TensorFlow: A system for large-scale machine learning"
          rel="noopener noreferrer"
          href="https://www.semanticscholar.org/paper/4954fa180728932959997a4768411ff9136aac81"
          target="_blank"
          className="group min-h-[82px] rounded-md border bg-card p-2 transition-colors hover:bg-card/50"
        >
          <div className="flex h-full w-full flex-col items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p
                className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-semibold"
                title="TensorFlow: A system for large-scale machine learning"
              >
                TensorFlow: A system for large-scale machine learning
              </p>

              <p
                className="line-clamp-3 whitespace-pre-wrap break-words text-xs"
                title="The TensorFlow dataflow model is described and the compelling performance that TensorFlow achieves for several real-world applications is demonstrated."
              >
                The TensorFlow dataflow model is described and the compelling
                performance that TensorFlow achieves for several real-world
                applications is demonstrated.
              </p>
            </div>

            <div className="flex flex-row items-center gap-1">
              <div
                className="relative overflow-hidden"
                style={{ minWidth: "16px" }}
              >
                <Image
                  title="Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms"
                  className="m-0 block rounded-full bg-transparent object-contain"
                  src="/semantic_logo.webp"
                  width={16}
                  height={16}
                  style={{
                    width: "16px",
                    height: "auto"
                  }}
                  alt="Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms"
                />
              </div>

              <span className="line-clamp-1 text-xs text-muted-foreground">
                Martín Abadi, P. Barham, Jianmin Chen, Z. Chen, et al.
              </span>
            </div>
          </div>
        </Link>
      </div>
    ),
    title: "academic-research",
    description: "academic-research-desc",
    icon: <IconBooks className="h-6 w-6" />,
    className: "md:col-span-2"
  },
  {
    title: "solve-math",
    description: "solve-math-desc",
    icon: <IconMath className="h-6 w-6" />,
    className: "md:col-span-1"
  },
  {
    title: "weather",
    description: "weather-desc",
    icon: <IconWind className="h-6 w-6" />,
    className: "md:col-span-1"
  },
  {
    title: "website-scraping",
    description: "website-scraping-desc",
    icon: <IconSitemap className="h-6 w-6" />,
    className: "md:col-span-1"
  },
  {
    title: "wikipedia",
    description: "wikipedia-desc",
    icon: <IconBrandWikipedia className="h-6 w-6" />,
    className: "md:col-span-1"
  }
]
