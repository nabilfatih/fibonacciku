"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

type Props = {
  src: string
  title: string
  className?: string
}

export default function BookCardImage({ src, title, className }: Props) {
  return (
    <div className={cn("relative h-24 w-16 sm:h-48 sm:w-36", className)}>
      <Image
        src={src}
        alt={title}
        sizes="144px"
        fill
        priority
        onError={e => {
          e.currentTarget.src = "/fibo-book.webp"
        }}
        className="rounded-xl border bg-muted/90 object-cover shadow-sm"
      />
    </div>
  )
}
