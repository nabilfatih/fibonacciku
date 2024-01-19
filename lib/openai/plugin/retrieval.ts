import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase"
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
      "You're only allowed to use the context below to answer the question. Answer the question based only on the following context:",
    sources: cleanData
  }
}

export const bookRetrieval = async (
  bookId: string,
  fileId: string,
  query: string
) => {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const metadata = {
    book_id: bookId,
    file_id: fileId
  }

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabaseAdmin,
    similarityK: 20,
    keywordK: 20,
    tableName: "books",
    similarityQueryName: "match_books",
    keywordQueryName: "kw_match_books",
    metadata
  })

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
    )
    // only get the first 10 documents
    .slice(0, 10)
    // oder by page number
    .sort((a, b) => a.page_number - b.page_number)

  return {
    message:
      "You're only allowed to use the context below to answer the question. Answer the question based only on the following context:",
    sources: cleanData
  }
}
