"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  IconBook2,
  IconDownload,
  IconFlag,
  IconList,
  IconMessageCirclePlus
} from "@tabler/icons-react"

import type { Books } from "@/types/types"
import { getBooksFileSignedUrl } from "@/lib/supabase/client/book"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

const BookDetailsSidebar = dynamic(
  () => import("@/components/book/details-sidebar")
)
const BookReportDialog = dynamic(
  () => import("@/components/book/report-dialog")
)

type Props = {
  book: Books
}

export default function BookActions({ book }: Props) {
  const [openReportDialog, setOpenReportDialog] = useState(false)
  const [openDetailsSidebar, setOpenDetailsSidebar] = useState(false)

  return (
    <div className="fixed inset-x-0 bottom-0 flex h-16 w-full items-center border-t duration-300 ease-in-out animate-in lg:h-[69px] peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <Link href="/book">
                  <IconBook2 className="h-5 w-5" />
                  <span className="sr-only">Search again</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search again</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenReportDialog(true)}
              >
                <IconFlag className="h-5 w-5" />
                <span className="sr-only">Report book</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Report book</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <BookReportDialog
          book={book}
          open={openReportDialog}
          onOpenChange={setOpenReportDialog}
          onReport={() => setOpenReportDialog(false)}
        />

        <BookDetailsSidebar
          open={openDetailsSidebar}
          onOpenChange={setOpenDetailsSidebar}
        >
          <div></div>
        </BookDetailsSidebar>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenDetailsSidebar(true)}
              >
                <IconList className="h-5 w-5" />
                <span className="sr-only">Book details</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Book details</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  // get signed url
                  const url = await getBooksFileSignedUrl(book.id, book.file_id)
                  // open new tab
                  window.open(url, "_blank")
                }}
              >
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
