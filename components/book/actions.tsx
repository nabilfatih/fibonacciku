import Link from "next/link"
import {
  IconChevronLeft,
  IconDownload,
  IconMessageCirclePlus
} from "@tabler/icons-react"

import type { Books } from "@/types/types"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

type Props = {
  book: Books
}

export default function BookActions({ book }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 flex h-16 w-full items-center border-t duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4">
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <Link href="/book">
                  <IconChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search again</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <IconDownload className="h-5 w-5" />
                <span className="sr-only">Download book</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download book</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <Link href={`/chat/book?collection=${book.id}`}>
                  <IconMessageCirclePlus className="h-5 w-5" />
                  <span className="sr-only">Chat with book</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat with book</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
