import type { Books } from "@/types/types"

import BookActions from "@/components/book/actions"
import BookDocument from "@/components/book/document"

export interface BookReadProps extends React.ComponentProps<"div"> {
  book: Books
  file: string
  page: number | null
}

export default function BookRead({
  book,
  file,
  page,
  className
}: BookReadProps) {
  return (
    <>
      <BookDocument file={file} page={page} className={className} />

      <BookActions book={book} />
    </>
  )
}
