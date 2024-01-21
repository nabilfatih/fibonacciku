import { cn } from "@/lib/utils"

export interface ChatExploreProps extends React.ComponentProps<"div"> {}

export default function ChatExplore({ className, ...props }: ChatExploreProps) {
  return (
    <>
      <main
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-48 sm:pb-52",
          className
        )}
      >
        <header className="border-b py-4">
          <div className="relative mx-auto max-w-2xl px-4">
            <h2 className="text-2xl font-semibold">Explore chat</h2>
          </div>
        </header>
      </main>
    </>
  )
}
