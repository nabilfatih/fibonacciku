import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconPhoto } from "@tabler/icons-react"

import type { ImageResult } from "@/types/types"
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
        <span className="font-medium">{t("generated-image")}:</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {metadata.map((item, index) => {
          return (
            <Link
              key={index}
              title={item.prompt || "Image"}
              href={item.image.split("?")[0]}
              target="_blank"
            >
              <Image
                src={item.image}
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
