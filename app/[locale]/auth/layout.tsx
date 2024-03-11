import Image from "next/image"
import Link from "next/link"

import { getStaticParams } from "@/locales/server"

import Particles from "@/components/ui/particles"
import AuthLanguage from "@/components/auth/language"
import ThemeToggle from "@/components/theme/toggle"

export function generateStaticParams() {
  return getStaticParams()
}

export default function AuthenticationLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative grid h-[100dvh] flex-col items-center justify-center text-foreground lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
        <AuthLanguage />
        <ThemeToggle side="bottom" align="end" />
      </div>
      <div className="relative hidden h-full flex-col border-r bg-muted p-10 lg:flex">
        <Particles
          className="pointer-events-none absolute inset-0 animate-fade-in"
          quantity={50}
        />
        <Link
          href="/home"
          className="relative z-20 flex w-fit items-center gap-2 text-lg font-medium"
        >
          <div className="relative h-6 w-6">
            <Image
              src="/logo-outline.webp"
              sizes="24px"
              fill
              priority
              alt="FibonacciKu"
              className="rounded-full object-cover shadow"
            />
          </div>
          <h1 className="font-semibold tracking-tighter">FibonacciKu</h1>
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &#34;I must say it&#39;s been a game-changer for me. It offers
              many tools that helps my studies to be more effective and it&#39;s
              affordable for us student too.&#34;
            </p>
            <footer className="text-sm">Nisrina Hana</footer>
          </blockquote>
        </div>
      </div>
      <div className="py-4 lg:p-8">
        <Link href="/home" className="flex justify-center lg:hidden">
          <Image
            src="/logo-outline.webp"
            width={32}
            height={32}
            priority
            alt="FibonacciKu"
            className="rounded-full object-cover shadow"
          />
        </Link>
        <main className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </main>
      </div>
    </div>
  )
}
