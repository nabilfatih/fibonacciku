import type { Books } from "@/types/types"

type Props = {
  book: Books
}

export default function BookDetails({ book }: Props) {
  return (
    <div className="relative py-2">
      <div className="grid"></div>
    </div>
  )
}
