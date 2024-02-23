import React, { memo } from "react"
import Image from "next/image"
import Link from "next/link"

import type { Attachment } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"
import { getChatAttachmentPublicUrl } from "@/lib/supabase/client/chat"

type Props = {
  metadata: Attachment[]
}

function ChatMetadataAttachment({ metadata }: Props) {
  const { userDetails } = useCurrentUser()

  if (!userDetails) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {metadata.map((attachment, index) => {
        const url = getChatAttachmentPublicUrl(
          userDetails.id,
          attachment.chat_id,
          attachment.file_id
        )
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

export default memo(ChatMetadataAttachment)
