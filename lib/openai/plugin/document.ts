import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase"
import {
  SupabaseVectorStore,
  type SupabaseFilterRPCCall
} from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"

import supabaseAdmin from "@/lib/supabase/admin"

export const documentRetrieval = async (
  userId: string,
  fileId: string,
  query: string
) => {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  // const filter: SupabaseFilterRPCCall = rpc =>
  //   rpc
  //     .filter("metadata->>file_id", "eq", fileId)
  //     .filter("metadata->>user_id", "eq", userId);

  // const store = await SupabaseVectorStore.fromExistingIndex(embeddings, {
  //   client: supabaseAdmin,
  //   tableName: "documents",
  //   queryName: "match_documents",
  // });

  const metadata = {
    file_id: fileId,
    user_id: userId
  }

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabaseAdmin,
    similarityK: 20,
    keywordK: 20,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
    metadata
  })

  // const results = await store.maxMarginalRelevanceSearch(query, {
  //   k: 10,
  //   fetchK: 10,
  //   filter,
  // });

  const results = await retriever.getRelevantDocuments(query, {
    metadata
  })

  const cleanData = results
    .map(doc => {
      return {
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        page_number: doc.metadata.page_number
      }
    })
    // remove duplicate page number
    .filter(
      (v, i, a) =>
        a.findIndex(t => t.metadata.page_number === v.metadata.page_number) ===
          i && v.metadata.file_id === fileId // Idk why the supabase return other documents, so I filter it here
      // this is only temporary solution
      // TODO: Maybe there is a better way to do this
    )
    // only get the first 10 documents
    .slice(0, 10)
    // oder by page number
    .sort((a, b) => a.page_number - b.page_number)

  return {
    message:
      "You're only allowed to use the documents below to answer the question. Answer the question based only on the following sources:",
    sources: cleanData
  }
}
