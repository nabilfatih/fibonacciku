import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import type { Document } from "langchain/document"
import { formatDocumentsAsString } from "langchain/util/document"

import type { Books } from "@/types/types"
import supabaseAdmin from "@/lib/supabase/admin"
import { getBooksAdmin } from "@/lib/supabase/admin/book"
import BookContent from "@/components/book/content"

export const runtime = "edge"

type MetadataBooks = {
  loc: any // Replace 'any' with the actual type if known.
  book_id: string
  file_id: string
  page_number: number
}

type DataBook = {
  pageContent: string
  metadata: MetadataBooks
}

type BookDocument = {
  bookId: string
  fileId: string
  data: DataBook[]
}

export type BookDocumentWithBooks = BookDocument & {
  books: Books
}

// Utility function to group and sort books by book_id
const groupBooksByBookId = (documents: Document[]): BookDocument[] => {
  const booksMap: { [key: string]: BookDocument } = {}

  documents.forEach((doc: any) => {
    const { book_id, file_id } = doc.metadata

    if (!booksMap[book_id]) {
      booksMap[book_id] = {
        bookId: book_id,
        fileId: file_id,
        data: []
      }
    }

    booksMap[book_id].data.push({
      pageContent: doc.pageContent,
      metadata: doc.metadata
    })
  })

  // Convert the map to an array
  const booksArray: BookDocument[] = Object.values(booksMap).map(book => ({
    ...book,
    // remove duplicates if page number is the same
    data: book.data.filter(
      (v, i, a) =>
        a.findIndex(t => t.metadata.page_number === v.metadata.page_number) ===
        i
    )
  }))

  return booksArray
}

type Props = {
  query: string
}

export default async function BookSearch({ query }: Props) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabaseAdmin,
    similarityK: 100,
    keywordK: 100,
    tableName: "books",
    similarityQueryName: "match_books",
    keywordQueryName: "kw_match_books"
  })

  const results = await retriever.getRelevantDocuments(query)

  const books = groupBooksByBookId(results)

  // get books from books_collection table
  const booksResults = (await Promise.all(
    books.map(async book => {
      const data = await getBooksAdmin(book.bookId)

      return {
        ...book,
        books: data
      }
    })
  )) as BookDocumentWithBooks[]

  return (
    <BookContent
      books={booksResults}
      query={query}
      document={formatDocumentsAsString(results.slice(0, 20))}
    />
  )
}
