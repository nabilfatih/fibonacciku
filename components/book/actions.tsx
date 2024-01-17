import Link from "next/link"
import { IconChevronLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

export default function BookActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 flex items-center h-16 w-full border-t duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto w-full max-w-2xl px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <Link href="/book">
                  <IconChevronLeft />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search again</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex-1">
          <div className="flex items-center"></div>
        </div>
      </div>
    </div>
  )
}
