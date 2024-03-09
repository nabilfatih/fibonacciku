import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="relative">
      <header className="py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-4">
          <Skeleton className="h-5 w-12"></Skeleton>
          <div className="mt-4 grid grid-cols-1 justify-between gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full"></Skeleton>
                <Skeleton className="h-10 w-4/5"></Skeleton>
                <Skeleton className="h-10 w-2/5"></Skeleton>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-4/5"></Skeleton>
                <Skeleton className="h-8 w-2/5"></Skeleton>
              </div>
            </div>

            <Skeleton className="h-[640px] w-[640px]"></Skeleton>
          </div>
        </div>
      </header>
    </div>
  )
}
