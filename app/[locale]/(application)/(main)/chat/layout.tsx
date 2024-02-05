import { Suspense } from "react"

import { MessageContextProvider } from "@/lib/context/use-message"

import Confetti from "@/components/ui/confetti"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <MessageContextProvider>
      <Confetti />
      <Suspense>{children}</Suspense>
    </MessageContextProvider>
  )
}
