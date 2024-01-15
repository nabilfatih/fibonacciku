import { getBooksAdmin } from "@/lib/supabase/admin/book"
import type { Metadata } from "next"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bookId = params.id
  const book = await getBooksAdmin(bookId)

  return {
    title: `${book?.title}`,
    alternates: {
      canonical: `/book/chat/${bookId}`,
      languages: {
        en: `/en/book/chat/${bookId}`,
        id: `/id/book/chat/${bookId}`,
        de: `/de/book/chat/${bookId}`
      }
    }
  }
}

export default function BookChatPage({ params, searchParams }: Props) {
  const bookId = params.id

  return <div></div>
}
