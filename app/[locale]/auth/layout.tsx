import { ThemeToggle } from "@/components/theme/toggle";
import Image from "next/image";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center text-foreground lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
        <div className="absolute inset-0 bg-muted" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <div className="relative h-6 w-6">
            <Image src="/logo.webp" fill priority alt="FibonacciKu" />
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
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}
