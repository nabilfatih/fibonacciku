import { NextResponse } from "next/server"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import { createDocumentsFromPages } from "@/lib/openai/helper"
import { EDEN_HEADERS, ENDPOINTS } from "@/lib/openai/plugin/ai"
import supabaseAdmin from "@/lib/supabase/admin"
import {
  getLibraryAll,
  updateLibraryStatusAdmin
} from "@/lib/supabase/admin/library"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

// TODO: Only run in your local machine

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }
  const libraries = await getLibraryAll()

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })

  // loop through all libraries
  for (const library of libraries) {
    const { public_id, id, user_id, name, file_id } = library
    // Fetch OCR results from Eden AI.
    const response = await fetch(
      `${ENDPOINTS.ocrAsync}/${public_id}?response_as_dict=true&show_original_response=false`,
      {
        method: "GET",
        headers: EDEN_HEADERS
      }
    )
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()

    // Skip if OCR process is not finished.
    if (data.status !== "finished") continue

    // Parse OCR results and prepare text for vector store.
    const results =
      data.results["microsoft"]?.pages || data.results["amazon"]?.pages
    const cleanData = results.map((page: any) =>
      page.lines.map((line: any) => line.text).join(" ")
    ) as string[]

    // Update library status if no data is found.
    if (!cleanData.length) {
      await updateLibraryStatusAdmin(id, "invalid")
      continue // Skip to next library.
    }

    // Create documents from the OCR results.
    const metadata = {
      user_id,
      file_id,
      num_pages: cleanData.length
    }
    const splitDocs = await createDocumentsFromPages(
      cleanData,
      textSplitter,
      metadata
    )

    await SupabaseVectorStore.fromDocuments(splitDocs, embeddings, {
      client: supabaseAdmin,
      tableName: "documents",
      queryName: "match_documents",
      filter: {
        user_id: library.user_id,
        file_id: library.file_id
      }
    })

    // make status of library to finished
    await updateLibraryStatusAdmin(library.id, "finished")
  }

  return NextResponse.json({ message: "Success" }, { status: 200 })
}
