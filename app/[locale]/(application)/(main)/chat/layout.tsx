import { MessageContextProvider } from "@/lib/context/use-message"
import { Suspense } from "react"

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
