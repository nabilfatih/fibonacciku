import type { Metadata } from "next"
import { getBooksAdmin } from "@/lib/supabase/admin/book"
import { cookies } from "next/headers"
import { createClientServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect(`/auth/login?next=/book/collection/${bookId}`)
  }

  return <main></main>
}
