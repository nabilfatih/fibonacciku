import React, { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWRImmutable from "swr/immutable"

import type { Attachment, UserDetails } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"
import { getChatAttachmentSignedUrl } from "@/lib/supabase/client/chat"

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

function ChatMetadataAttachment({ metadata }: Props) {
  const { userDetails } = useCurrentUser()
  const { data: imageUrls, isLoading } = useSWRImmutable(
    [userDetails, metadata],
    fetchChatAttachment,
    {
      refreshInterval: 1000 * 60 * 60 * 24 // 24 hours
    }
  )

  if (isLoading || !imageUrls) return <Loading />

  return (
    <div className="grid grid-cols-2 gap-4">
      {imageUrls.map((url, index) => {
        return (
          <Link key={url} href={url} target="_blank">
            <Image
              src={url}
              alt={`Attachment ${index + 1}`}
              sizes="100%"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "16rem"
              }}
              width={256}
              height={256}
              unoptimized // decrease cost of image optimization
              className="m-0 cursor-pointer rounded-xl border bg-muted/90 object-cover shadow"
            />
          </Link>
        )
      })}
    </div>
  )
}

function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="m-0 block h-64 w-64 rounded-xl border bg-muted/90 object-cover" />
    </div>
  )
}

export default memo(ChatMetadataAttachment)
