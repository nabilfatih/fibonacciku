import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import supabaseAdmin from "@/lib/supabase/admin";
import { createDocumentsFromPages } from "@/utils/openai/helper";
import { updateBooksStatusAdmin } from "@/lib/supabase/admin/book";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds

// Based on https://docs.edenai.co/docs/webhooks
// Somehow the verification of the signature is not working

type WebhookParam = {
  bookId: string;
  fileId: string;
};

export async function POST(req: Request) {
  if (req.method === "POST") {
    // Get the JSON payload of the webhook
    const payload = await req.json();

    const webhookParam = payload.users_webhook_parameters as WebhookParam;

    // Get the signature and hash algorithm from the headers
    const signature = req.headers.get("x-edenai-signature");
    const hashAlgorithm = req.headers.get("x-edenai-hash-algorithm");

    if (!signature || !hashAlgorithm) {
      // make status of library to invalid
      await updateBooksStatusAdmin(webhookParam.bookId, "invalid");
      console.error("❌ Missing signature or hash algorithm");
      return NextResponse.json(
        {
          error: {
            statusCode: 400,
            message: "Webhook Error: Missing signature or hash algorithm",
          },
        },
        { status: 400 }
      );
    }

    // Logging the signature
    console.log("Signature:", signature);

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const pages =
      payload.results["microsoft"]?.pages || payload.results["amazon"]?.pages;

    if (!pages) {
      // make status of books to invalid
      await updateBooksStatusAdmin(webhookParam.bookId, "invalid");
      console.error("❌ Invalid books, no pages");
      return NextResponse.json(
        { error: { statusCode: 400, message: "Invalid books" } },
        { status: 400 }
      );
    }

    const data = pages.map((data: any) =>
      data.lines.map((line: any) => line.text).join(" ")
    );

    if (data.length === 0) {
      // make status of books to invalid
      await updateBooksStatusAdmin(webhookParam.bookId, "invalid");
      console.error("❌ Invalid books, no data in pages");
      return NextResponse.json(
        { error: { statusCode: 400, message: "Invalid books" } },
        { status: 400 }
      );
    }

    // Define metadata for the books
    const metadata = {
      book_id: webhookParam.bookId,
      file_id: webhookParam.fileId,
      num_pages: data.length,
    };

    const splitDocs = await createDocumentsFromPages(
      data,
      textSplitter,
      metadata
    );

    await SupabaseVectorStore.fromDocuments(splitDocs, embeddings, {
      client: supabaseAdmin,
      tableName: "books",
      queryName: "match_books",
      filter: {
        book_id: webhookParam.bookId,
        file_id: webhookParam.fileId,
      },
    });

    // make status of library to finished
    await updateBooksStatusAdmin(webhookParam.bookId, "finished");

    return NextResponse.json(
      {
        message: "Document uploaded successfully",
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { error: { statusCode: 405, message: "Method not allowed" } },
      { status: 405 }
    );
  }
}
