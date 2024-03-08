import { IconSpinner } from "@/components/ui/icons"

export default function Loading() {
  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <IconSpinner className="h-8 w-8 animate-spin" />
    </div>
  )
}
