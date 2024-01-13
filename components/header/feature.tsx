"use client"

import { useParams, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  IconApps,
  IconBook2,
  IconChevronDown,
  IconFile,
  IconMessageCircle2,
  IconSpy
} from "@tabler/icons-react"
import { useScopedI18n } from "@/locales/client"

const features = new Set(["assistant", "document", "book", "detector"])

function FeatureIcon({ type }: { type: string }) {
  switch (type) {
    case "assistant":
      return <IconMessageCircle2 className="mr-2 h-4 w-4" />
    case "document":
      return <IconFile className="mr-2 h-4 w-4" />
    case "book":
      return <IconBook2 className="mr-2 h-4 w-4" />
    case "detector":
      return <IconSpy className="mr-2 h-4 w-4" />
    default:
      return <IconApps className="mr-2 h-4 w-4" />
  }
}

export default function HeaderChatFeature() {
  const t = useScopedI18n("Feature")
  const pathname = usePathname()
  const params = useParams()

  // get type from params, but for book get from /book
  const type = (params.feature as string) || pathname.split("/")[1]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-9 sm:h-9 sm:w-auto">
          <div className="hidden items-center sm:flex">
            <FeatureIcon type={type} />
            {features.has(type) ? t(type as never) : t("application")}
            <IconChevronDown className="ml-1 h-4 w-4" />
          </div>
          <div className="inline-flex sm:hidden">
            <IconApps className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} align="end" className="w-full p-2">
        {featuresData.map(feature => (
          <DropdownMenuLabel
            key={feature.type}
            asChild
            className="cursor-pointer items-center rounded-sm py-2 transition-colors hover:bg-accent"
          >
            <Link
              href={feature.link}
              className="flex w-full items-center cursor-pointer"
            >
              <feature.icon className="mr-2 h-4 w-4" />
              <p className="font-medium">{t(feature.type as never)}</p>
            </Link>
          </DropdownMenuLabel>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const featuresData = [
  {
    type: "assistant",
    link: "/chat/assistant",
    icon: IconMessageCircle2
  },
  {
    type: "document",
    link: "/chat/document",
    icon: IconFile
  },
  {
    type: "book",
    link: "/book",
    icon: IconBook2
  },
  {
    type: "detector",
    link: "/detector/ai",
    icon: IconSpy
  }
]
