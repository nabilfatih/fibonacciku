import { IconSpinner } from "@/components/ui/icons"
import MarketingTransition from "@/components/marketing/transition"

export default function Loading() {
  return (
    <MarketingTransition className="flex h-full items-center justify-center">
      <IconSpinner className="h-8 w-8 animate-spin" />
    </MarketingTransition>
  )
}
