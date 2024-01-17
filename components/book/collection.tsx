import type { Books } from "@/types/types"
import BookDocument from "@/components/book/document"
import BookActions from "@/components/book/actions"

export interface BookCollectionProps extends React.ComponentProps<"div"> {
  book: Books
  file: string
  page: number | null
}

export default function BookCollection({
  book,
  file,
  page,
  className
}: BookCollectionProps) {
  return (
    <>
      <BookDocument book={book} file={file} page={page} className={className} />

      <BookActions />
    </>
  )
}
