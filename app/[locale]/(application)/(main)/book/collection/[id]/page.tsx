import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { getBooksAdmin } from "@/lib/supabase/admin/book"
import { createClientServer } from "@/lib/supabase/server"

import BookCollection from "@/components/book/collection"

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
      canonical: `/book/collection/${bookId}`,
      languages: {
        en: `/en/book/collection/${bookId}`,
        id: `/id/book/collection/${bookId}`,
        de: `/de/book/collection/${bookId}`
      }
    }
  }
}

export default async function BookCollectionSpecificPage({
  params,
  searchParams
}: Props) {
  const bookId = params.id

  // from string to number
  const page = parseInt(searchParams.page as string) || null

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
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

  return <BookCollection book={book} file={signedUrl} page={page} />
}
