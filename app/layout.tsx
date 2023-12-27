import "@/styles/globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/development/tailwind-indicator";
import { Providers } from "@/components/providers/theme";

export const metadata: Metadata = {
  title: "FibonacciKu",
  description: "FibonacciKu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1">{children}</main>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
