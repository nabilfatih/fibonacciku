"use client"

import { memo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Props = {
  src: string | undefined
  alt: string | undefined
}

function ImageMarkdown({ src, alt }: Props) {
  const [isError, setIsError] = useState(false)

  if (!src) return null

  if (isError) return null

  const dataSrc = src.trim()

  if (dataSrc.includes("i.ytimg.com")) {
    return (
      <Link href={dataSrc} target="_blank">
        <Image
          src={src}
          alt={alt || "Thumbnail YouTube"}
          unoptimized
          width={337}
          height={192}
          className="relative my-4 h-[8rem] w-full cursor-pointer rounded-xl border bg-muted/90 object-cover shadow sm:h-48 sm:w-[337px]"
        />
      </Link>
    )
  }

  if (dataSrc.includes("auth.fibonacciku.com")) {
    return (
      <Link href={dataSrc} target="_blank">
        <Image
          src={src}
          alt={alt || "Image"}
          sizes="100%"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "28rem"
          }}
          unoptimized
          width={256}
          height={256}
          className="m-0 mt-4 cursor-pointer rounded-xl border bg-muted/90 object-cover shadow"
        />
      </Link>
    )
  }

  return (
    <Link href={dataSrc} target="_blank">
      <Image
        src={dataSrc}
        alt={alt || "Image"}
        sizes="100%"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "28rem"
        }}
        unoptimized
        width={256}
        height={256}
        onError={() => setIsError(true)}
        className="my-4 max-w-[256px] cursor-pointer rounded-xl border bg-muted/90 object-cover shadow"
      />
    </Link>
  )
}

export default memo(ImageMarkdown)
