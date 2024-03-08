import { IconSpinner } from "@/components/ui/icons"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <IconSpinner className="h-8 w-8 animate-spin" />
    </div>
  )
}
