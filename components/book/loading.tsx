import { Skeleton } from "@/components/ui/skeleton"

export default function BookLoading() {
  return (
    <main className="h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10">
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="flex items-start sm:px-1">
          <Skeleton className="relative mr-2 h-24 w-16 flex-none sm:mr-4 sm:h-48 sm:w-36" />
          <div className="flex-1">
            <div className="flex flex-col">
              <Skeleton className="sm:h-7 h-4 mb-2" />
              <Skeleton className="sm:h-7 h-4 w-2/3 mb-2" />
              <Skeleton className="sm:h-7 h-4 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
