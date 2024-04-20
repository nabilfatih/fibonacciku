import { NextResponse } from "next/server"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import { createDocumentsFromPages } from "@/lib/openai/helper"
import { EDEN_HEADERS, ENDPOINTS } from "@/lib/openai/plugin/ai"
import supabaseAdmin from "@/lib/supabase/admin"
import {
  getBooksProcessingAdmin,
  updateBooksStatusAdmin
} from "@/lib/supabase/admin/book"

export const dynamic = "force-dynamic"

// TODO: THIS CRON JOB IS FOR PROCESSING DOCUMENTS
// TODO: SOMETIME EDEN AI WEBHOOKS ARE NOT WORKING

export async function GET(req: Request) {
  // Authenticate the request
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }

  if (req.method === "GET") {
    // get the books that are processing
    const books = await getBooksProcessingAdmin()

    if (!books.length) {
      return NextResponse.json(
        { message: "No books to process" },
        { status: 200 }
      )
    }

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY
    })

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    try {
      // Instead of Promise.all, use a for loop to process each book sequentially
      for (const book of books) {
        const response = await fetch(
          `${ENDPOINTS.ocrAsync}/${book.public_id}?response_as_dict=true&show_original_response=false`,
          {
            method: "GET",
            headers: EDEN_HEADERS
          }
        )

        if (!response.ok) throw new Error(response.statusText)
        const data = await response.json()

        if (data.status !== "finished") {
          // Skip if OCR process is not finished.
          continue
        }

        const results =
          data.results["microsoft"]?.pages || data.results["amazon"]?.pages

        if (!results) {
          await updateBooksStatusAdmin(book.id, "invalid")
          continue
        }

        const cleanData = results.map((page: any) =>
          page.lines.map((line: any) => line.text).join(" ")
        )

        if (!cleanData.length) {
          await updateBooksStatusAdmin(book.id, "invalid")
          continue
        }

        const metadata = {
          book_id: book.id,
          file_id: book.file_id,
          num_pages: cleanData.length
        }

        const splitDocs = await createDocumentsFromPages(
          cleanData,
          textSplitter,
          metadata
        )

        console.log("Processing book:", book.id)

        await SupabaseVectorStore.fromDocuments(splitDocs, embeddings, {
          client: supabaseAdmin,
          tableName: "books",
          queryName: "match_books",
          filter: {
            book_id: book.id,
            file_id: book.file_id
          }
        })

        console.log("Finished processing book:", book.id)

        await updateBooksStatusAdmin(book.id, "finished")
      }

      return NextResponse.json({ message: "Success" }, { status: 200 })
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: { statusCode: 500, message: "Internal Server Error" } },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json(
      { error: { statusCode: 405, message: "Method not allowed" } },
      { status: 405 }
    )
  }
}
