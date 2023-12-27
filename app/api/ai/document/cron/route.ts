import {
  getLibraryProcessingAdmin,
  updateLibraryStatusAdmin,
} from "@/lib/supabase/admin/library";
import { createDocumentsFromPages } from "@/lib/openai/helper";
import { EDEN_HEADERS, ENDPOINTS } from "@/lib/openai/plugin/ai";
import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import supabaseAdmin from "@/lib/supabase/admin";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Authenticate the request
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    );
  }

  // get the libraries that are processing
  const libraries = await getLibraryProcessingAdmin();

  // if there are no libraries, return 200
  if (!libraries.length) {
    return NextResponse.json(
      { message: "No libraries to process" },
      { status: 200 }
    );
  }

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  try {
    // Use a for loop to process each library one by one
    for (const library of libraries) {
      const { public_id, id } = library;
      // Fetch OCR results from Eden AI.
      const response = await fetch(
        `${ENDPOINTS.ocrAsync}/${public_id}?response_as_dict=true&show_original_response=false`,
        {
          method: "GET",
          headers: EDEN_HEADERS,
        }
      );
      if (!response.ok) {
        await updateLibraryStatusAdmin(id, "invalid");
        continue;
      }
      const data = await response.json();

      // Skip if OCR process is not finished.
      if (data.status !== "finished") {
        // Update status to waiting if not finished
        await updateLibraryStatusAdmin(id, "processing");
        continue;
      }

      // Parse OCR results and prepare text for vector store.
      const results =
        data.results["microsoft"]?.pages || data.results["amazon"]?.pages;

      if (!results || results.length === 0) {
        await updateLibraryStatusAdmin(id, "invalid");
        continue;
      }

      const cleanData = results.map((page: any) =>
        page.lines.map((line: any) => line.text).join(" ")
      );

      // Create documents from the OCR results.
      const metadata = {
        user_id: library.user_id,
        file_id: library.file_id,
        num_pages: cleanData.length,
      };
      const splitDocs = await createDocumentsFromPages(
        cleanData,
        textSplitter,
        metadata
      );

      await SupabaseVectorStore.fromDocuments(splitDocs, embeddings, {
        client: supabaseAdmin,
        tableName: "documents",
        queryName: "match_documents",
        filter: {
          user_id: library.user_id,
          file_id: library.file_id,
        },
      });

      console.log("Processing library:", id);

      // Make status of library to finished
      await updateLibraryStatusAdmin(id, "finished");
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(`Error processing libraries: ${error}`);
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
