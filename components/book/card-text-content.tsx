import { useEffect, useRef, useState } from "react"
import type { BookDocumentWithBooks } from "@/components/book/search"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"
import { Button } from "@/components/ui/button"

type Props = {
  book: BookDocumentWithBooks
}

export default function BookCardTextContent({ book }: Props) {
  const t = useScopedI18n("CardBook")
  const textRef = useRef<HTMLParagraphElement | null>(null)
  const [contentExpand, setContentExpand] = useState<string>("")
  const [isOverflow, setIsOverflow] = useState<boolean>(false)

  useEffect(() => {
    const checkOverflow = () => {
      const current = textRef.current
      if (current) {
        // This is where we check if the text is actually overflowing
        const isOverflowing = current.clientHeight < current.scrollHeight
        setIsOverflow(isOverflowing)
      }
    }

    checkOverflow()
    // You might want to check overflow on window resize or any other events that might change the text size
    window.addEventListener("resize", checkOverflow)

    // Cleanup the event listener
    return () => window.removeEventListener("resize", checkOverflow)
  }, [])
  return (
    <div className="mb-6">
      <p
        ref={textRef}
        className={cn(
          "mb-1 max-w-[263px] break-words text-sm sm:max-w-none",
          contentExpand !== book.bookId ? "line-clamp-3" : "line-clamp-none"
        )}
      >
        ...{book.data[0].pageContent}...
      </p>
      {isOverflow && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setContentExpand(prev => (prev === book.bookId ? "" : book.bookId))
          }}
        >
          {contentExpand === book.bookId ? t("collapse") : t("expand")}
        </Button>
      )}
    </div>
  )
}
