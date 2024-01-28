import dynamic from "next/dynamic"
import Image from "next/image"

import AuthLanguage from "@/components/auth/language"
import { ThemeToggle } from "@/components/theme/toggle"

const Particles = dynamic(() => import("@/components/ui/particles"), {
  ssr: false
})

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
          className="pointer-events-none absolute inset-0"
          quantity={40}
        />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <div className="relative h-6 w-6">
            <Image
              src="/logo.webp"
              sizes="24px"
              fill
              priority
              alt="FibonacciKu"
            />
          </div>
          <span className="font-semibold">FibonacciKu</span>
        </div>
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
        <div className="mb-4 flex justify-center lg:hidden">
          <Image
            src="/logo.webp"
            width={32}
            height={32}
            priority
            alt="FibonacciKu"
          />
        </div>
        <main className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </main>
      </div>
    </div>
  )
}
