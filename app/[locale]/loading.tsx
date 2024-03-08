import { IconSpinner } from "@/components/ui/icons"

export default function Loading() {
  return (
    <main className="flex h-screen flex-1 flex-col overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <IconSpinner className="h-12 w-12 animate-spin" />
          </div>
        </div>
      </div>
    </main>
  )
}
