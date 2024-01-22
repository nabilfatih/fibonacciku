import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { IconX } from "@tabler/icons-react"
import useSWR from "swr"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useMessage } from "@/lib/context/use-message"
import {
  getBooksCoverPublicUrl,
  getBooksFileSignedUrl
} from "@/lib/supabase/client/book"

import { Button } from "@/components/ui/button"
import { IconSpinner } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { getBookCollection } from "@/app/actions"

export default function EmptyScreenBook() {
  const searchParams = useSearchParams()
  const collection = searchParams.get("collection")

  const { data, isLoading } = useSWR(
    collection ? collection : null,
    getBookCollection
  )

  const { append, dispatch } = useMessage()
  const { userDetails } = useCurrentUser()

  const [loadingId, setLoadingId] = useState<string | null>(null)

  const bookData = useMemo(() => {
    if (!data) return null
    if ("error" in data) return null
    const coverUrl = getBooksCoverPublicUrl(data.id, data.file_id)
    return {
      ...data,
      coverUrl
    }
  }, [data])

  return (
    <div className="space-y-6">
      <p className="leading-normal text-muted-foreground">
        Easily explore knowledge from the book.
      </p>

      {isLoading ? (
        <div className="flex">
          <Skeleton className="h-52 w-36 sm:h-48" />
        </div>
      ) : (
        <>
          {bookData && (
            <div className="flex flex-wrap">
              <div
                role="button"
                className="relative h-52 w-36 cursor-pointer sm:h-48"
                onClick={async () => {
                  if (loadingId === bookData.id) return
                  if (!userDetails) return
                  setLoadingId(bookData.id)
                  const currentDocument = await getBooksFileSignedUrl(
                    bookData.id,
                    bookData.file_id
                  )
                  dispatch({
                    type: "SET_CURRENT_DOCUMENT",
                    payload: currentDocument
                  })
                  // get random number between 3-5 for the questions
                  const number = Math.floor(Math.random() * (5 - 3 + 1)) + 3
                  // TODO: Must be in locale language (Refactor this!)
                  const firstPrompt = `Give me ${number} questions that I can ask to you related to this book.`
                  const keyId = `${bookData.id}--${bookData.file_id}`
                  append(false, keyId, firstPrompt)
                  setLoadingId(null)
                }}
              >
                <Image
                  src={bookData.coverUrl}
                  alt={bookData.title}
                  sizes="148px"
                  priority
                  fill
                  className="rounded-xl border bg-muted/90 object-cover shadow-sm"
                />
              </div>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="ml-2 rounded-full"
                disabled={loadingId === bookData.id}
              >
                <Link href={`/book/collection/${bookData.id}`}>
                  {loadingId === bookData.id ? (
                    <IconSpinner />
                  ) : (
                    <IconX className="h-5 w-5 " />
                  )}
                  <span className="sr-only">Close</span>
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
