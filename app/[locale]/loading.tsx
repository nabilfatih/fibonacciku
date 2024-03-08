import { IconSpinner } from "@/components/ui/icons"
import MarketingTransition from "@/components/marketing/transition"

export default function Loading() {
  return (
    <MarketingTransition className="flex h-[100dvh] items-center justify-center">
      <IconSpinner className="h-8 w-8 animate-spin" />
    </MarketingTransition>
  )
}
