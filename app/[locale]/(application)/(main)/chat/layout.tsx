import { Suspense } from "react"

import { MessageContextProvider } from "@/lib/context/use-message"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <MessageContextProvider>
      <Suspense>{children}</Suspense>
    </MessageContextProvider>
  )
}
