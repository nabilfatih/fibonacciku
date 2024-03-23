import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconPhoto } from "@tabler/icons-react"

import type { ImageResult } from "@/types/types"
import { getChatImagePublicUrl } from "@/lib/supabase/client/chat"
import { useScopedI18n } from "@/locales/client"

type Props = {
  metadata: ImageResult[]
}

function ChatMetadataImage({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")
  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-2">
        <IconPhoto className="h-5 w-5" />
        <p className="font-medium">{t("generated-image")}:</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {metadata.map((item, index) => {
          const url = item.image.split("?")[0]
          // https://auth.fibonacciku.com/storage/v1/object/public/images/b64ed057-14f7-4968-a4b1-b0ca6ffbe641/dd180dc3-4108-4ab6-a9e1-709041acb93c/2df142da73764f668d0ea
          // split to get userId, chatId, and fileId
          const [userId, chatId, fileId] = url.split("/").slice(-3)

          const urlImage = getChatImagePublicUrl(userId, chatId, fileId)

          return (
            <Link
              key={index}
              title={item.prompt || "Image"}
              href={urlImage}
              target="_blank"
            >
              <Image
                src={urlImage}
                alt={item.prompt || "Image"}
                sizes="100%"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "28rem"
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
    </div>
  )
}

export default memo(ChatMetadataImage)
