import { NextResponse } from "next/server"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import { createDocumentsFromPages } from "@/lib/openai/helper"
import supabaseAdmin from "@/lib/supabase/admin"
import { updateLibraryStatusAdmin } from "@/lib/supabase/admin/library"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

// Based on https://docs.edenai.co/docs/webhooks
// Somehow the verification of the signature is not working

type WebhookParam = {
  fileId: string
  userId: string
  libraryId: string
  fileName: string
}

export async function POST(req: Request) {
  if (req.method === "POST") {
    // Get the JSON payload of the webhook
    const payload = await req.json()

    const webhookParam = payload.users_webhook_parameters as WebhookParam

    // Get the signature and hash algorithm from the headers
    const signature = req.headers.get("x-edenai-signature")
    const hashAlgorithm = req.headers.get("x-edenai-hash-algorithm")

    if (!signature || !hashAlgorithm) {
      // make status of library to invalid
      await updateLibraryStatusAdmin(webhookParam.libraryId, "invalid")
      console.error("❌ Missing signature or hash algorithm")
      return NextResponse.json(
        {
          error: {
            statusCode: 400,
            message: "Webhook Error: Missing signature or hash algorithm"
          }
        },
        { status: 400 }
      )
    }

    // Logging the signature
    console.log("Signature:", signature)

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY
    })

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const pages =
      payload.results["microsoft"]?.pages || payload.results["amazon"]?.pages

    if (!pages) {
      // make status of library to invalid
      await updateLibraryStatusAdmin(webhookParam.libraryId, "invalid")
      console.error("❌ Missing pages, invalid document")
      return NextResponse.json(
        {
          error: {
            statusCode: 400,
            message: "Webhook Error: Missing pages"
          }
        },
        { status: 400 }
      )
    }

    const data = pages.map((data: any) =>
      data.lines.map((line: any) => line.text).join(" ")
    )

    if (data.length === 0) {
      // make status of library to invalid
      await updateLibraryStatusAdmin(webhookParam.libraryId, "invalid")
      console.error("❌ Invalid document, no data in pages")
      return NextResponse.json(
        { error: { statusCode: 400, message: "Invalid document" } },
        { status: 400 }
      )
    }

    // Define metadata for the document
    const metadata = {
      user_id: webhookParam.userId,
      file_id: webhookParam.fileId,
      num_pages: data.length
    }

    const splitDocs = await createDocumentsFromPages(
      data,
      textSplitter,
      metadata
    )

    await SupabaseVectorStore.fromDocuments(splitDocs, embeddings, {
      client: supabaseAdmin,
      tableName: "documents",
      queryName: "match_documents",
      filter: {
        user_id: webhookParam.userId,
        file_id: webhookParam.fileId
      }
    })

    console.log("Processing library:", webhookParam.libraryId)

    // make status of library to finished
    await updateLibraryStatusAdmin(webhookParam.libraryId, "finished")

    return NextResponse.json(
      {
        message: "Document uploaded successfully"
      },
      { status: 200 }
    )
  } else {
    return NextResponse.json(
      { error: { statusCode: 405, message: "Method not allowed" } },
      { status: 405 }
    )
  }
}
