import Link from "next/link"
import { IconRocket } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import ChatFeature from "@/components/chat/feature"

export default function EmptyScreenAssistant() {
  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        Ask me anything, whatever you want to know.
      </p>

      <div className="grid">
        <h2 className="mb-2 font-medium tracking-tight">
          Explore what you can do with me:
        </h2>

        <Button asChild variant="outline" className="w-fit">
          <Link href="/chat/explore" className="inline-flex items-center">
            <IconRocket className="mr-2 h-5 w-5" />
            Start exploring
          </Link>
        </Button>
      </div>

      <ChatFeature />
    </div>
  )
}
