import React, { useEffect, useState } from "react"
import Image from "next/image"
import useSWR from "swr"

import type { Attachment, UserDetails } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"
import { getChatAttachmentSignedUrl } from "@/lib/supabase/client/chat"
import { cn } from "@/lib/utils"

async function fetchChatAttachment([userDetails, metadata]: [
  UserDetails,
  Attachment[]
]) {
  const userId = userDetails.id
  if (!userId) return []
  const urls = await Promise.all(
    metadata.map(item =>
      getChatAttachmentSignedUrl(userId, item.chat_id, item.file_id)
    )
  )
  return urls
}

type Props = {
  metadata: Attachment[]
}

export default function ChatMetadataAttachment({ metadata }: Props) {
  const { userDetails } = useCurrentUser()
  const { data } = useSWR(
    userDetails && metadata.length > 0 ? [userDetails, metadata] : null,
    fetchChatAttachment,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false
    }
  )

  const [loaded, setLoaded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    if (data) {
      setImageUrls(data)
      setLoaded(true)
    }
  }, [data])

  return (
    <>
      {!loaded ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap gap-4">
          {imageUrls.map((url, index) => {
            return (
              <div key={url} className="relative rounded-xl">
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
                  unoptimized // decrease cost of image optimization
                  className={cn(
                    "m-0 cursor-pointer rounded-xl border bg-muted/90 object-cover shadow-sm",
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
