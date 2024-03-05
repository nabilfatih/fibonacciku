import { cache } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { getBooksAdmin } from "@/lib/supabase/admin/book"
import { createClientServer } from "@/lib/supabase/server"

import BookRead from "@/components/book/read"

const getBook = cache(async (bookId: string) => {
  const book = await getBooksAdmin(bookId)
  // if there is book return the title, if not return FibonacciKu
  return book?.title ?? "FibonacciKu"
})

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bookId = params.id
  const title = await getBook(bookId)

  return {
    title: title,
    alternates: {
      canonical: `/book/collection/${bookId}`,
      languages: {
        en: `/en/book/collection/${bookId}`,
        id: `/id/book/collection/${bookId}`,
        de: `/de/book/collection/${bookId}`,
        ru: `/ru/book/collection/${bookId}`,
        nl: `/nl/book/collection/${bookId}`
      }
    }
  }
}

export default async function BookReadSpecificPage({
  params,
  searchParams
}: Props) {
  const bookId = params.id

  // from string to number
  const page = parseInt(searchParams.page as string) || null

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=/book/collection/${bookId}`)
  }

  const { data: book } = await supabase
    .from("books_collection")
    .select("*")
    .eq("id", bookId)
    .limit(1)
    .maybeSingle()

  if (!book) {
    notFound()
  }

  // get signed url of book
  const { data } = await supabase.storage
    .from("books")
    .createSignedUrl(`${bookId}/${book.file_id}`, 3600 * 24) // 1 day

  if (!data) {
    notFound()
  }

  const signedUrl = data.signedUrl

  return <BookRead book={book} file={signedUrl} page={page} />
}
