import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"

import type { Attachment } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"
import { getChatAttachmentSignedUrl } from "@/lib/supabase/client/chat"
import { cn } from "@/lib/utils"

type Props = {
  metadata: Attachment[]
}

export default function ChatMetadataAttachment({ metadata }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const { userDetails } = useCurrentUser()
  const params = useParams()
  const chatId = params.id

  // We'll fetch all URLs at once and store them in our imageUrls state.
  useEffect(() => {
    if (userDetails && metadata.length > 0) {
      Promise.all(
        metadata.map(item =>
          getChatAttachmentSignedUrl(
            userDetails.id,
            item.chat_id || String(chatId),
            item.file_id
          )
        )
      ).then(urls => {
        setImageUrls(urls)
        setLoaded(true) // Now we set loaded true after all URLs are fetched.
      })
    }
  }, [chatId, metadata, userDetails])

  return (
    <>
      {!loaded ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap gap-4">
          {imageUrls.map((url, index) => {
            return (
              <div key={index} className="relative rounded-xl">
                {!imageLoaded && (
                  <div className="m-0 block h-64 w-64 animate-pulse rounded-xl border bg-muted/90 object-cover" />
                )}
                <Image
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  sizes="100%"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "16rem"
                  }}
                  priority
                  width={256}
                  height={256}
                  onLoad={() => setImageLoaded(true)}
                  onClick={async () => {
                    const imageUrl = url
                    window.open(imageUrl, "_blank")
                    return false // Prevents link from opening in new tab
                  }}
                  className={cn(
                    "m-0 cursor-pointer rounded-xl border bg-muted/90 shadow-sm",
                    imageLoaded ? "block" : "hidden"
                  )}
                />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

function Loading() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="m-0 block h-64 w-64 animate-pulse rounded-xl border bg-muted/90 object-cover" />
    </div>
  )
}
