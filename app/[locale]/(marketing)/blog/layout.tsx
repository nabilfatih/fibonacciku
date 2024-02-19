import { Suspense } from "react"

export default function BlogLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden"></div>
      }
    >
      {children}
    </Suspense>
  )
}
