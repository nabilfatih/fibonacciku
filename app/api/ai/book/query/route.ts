import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { SupabaseHybridSearch } from "langchain/retrievers/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { getBooksAdmin } from "@/lib/supabase/admin/book"
import { createClientServer } from "@/lib/supabase/server"
import type { Books } from "@/types/types"
import type { Document } from "langchain/document"
import supabaseAdmin from "@/lib/supabase/admin"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

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

type BookDocumentWithBooks = BookDocument & {
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
    data: book.data
  }))

  return booksArray
}

export async function POST(req: NextRequest) {
  const { query } = (await req.json()) as {
    query: string
  }
  // get token from auth header
  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!token) {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)

  // check if user exists with the token provided in the auth header
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("access_token", token)
    .single()

  if (!user) {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }

  try {
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY
    })

    const retriever = new SupabaseHybridSearch(embeddings, {
      client: supabaseAdmin,
      //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
      similarityK: 50,
      keywordK: 50,
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

    return NextResponse.json(
      {
        data: booksResults
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }
}
