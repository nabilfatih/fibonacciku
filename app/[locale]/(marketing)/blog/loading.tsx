import { Skeleton } from "@/components/ui/skeleton"
import MarketingTransition from "@/components/marketing/transition"

export default function Loading() {
  return (
    <MarketingTransition className="relative">
      <header className="bg-muted py-16">
        <div className="relative mx-auto max-w-7xl px-4">
          <Skeleton className="h-16 w-32"></Skeleton>
          <Skeleton className="mt-6 h-6 w-1/2"></Skeleton>
        </div>
      </header>

      <section className="py-24">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="border-b pb-4">
            <Skeleton className="h-8 w-64"></Skeleton>
          </div>

          <div className="pb-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group relative mt-12">
                  <Skeleton className="h-[311px] w-full"></Skeleton>
                  <div className="relative mt-2 grid gap-1.5 break-words">
                    <Skeleton className="h-5 w-3/4"></Skeleton>
                    <Skeleton className="h-4 w-1/2"></Skeleton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingTransition>
  )
}
