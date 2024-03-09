import { unstable_cache as cache } from "next/cache"
import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import type { Document } from "langchain/document"

import supabaseAdmin from "@/lib/supabase/admin"
import { replaceSpecialChars } from "@/lib/utils"

export const documentRetrieval = cache(
  async (userId: string, fileId: string, query: string) => {
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
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

    try {
      const results = await retriever.getRelevantDocuments(query, {
        metadata
      })

      const cleanData = formatCleanData(results, 5, fileId)

      return {
        message:
          "You're only allowed to use the context below to answer the question. Answer the question based only on the following context:",
        sources: cleanData
      }
    } catch (error) {
      console.log(error)
      return {
        message:
          "You're only allowed to use the context below to answer the question. Answer the question based only on the following context:",
        sources: []
      }
    }
  },
  ["documentRetrieval"],
  {
    revalidate: 3600
  }
)

export const bookRetrieval = cache(
  async (bookId: string, fileId: string, query: string) => {
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
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

    try {
      const results = await retriever.getRelevantDocuments(query, {
        metadata
      })

      const cleanData = formatCleanData(results, 5, fileId)

      return {
        message:
          "You're only allowed to use the context below to answer the question. Answer the question based only on the following context:",
        sources: cleanData
      }
    } catch (error) {
      console.log(error)
      return {
        message:
          "You're only allowed to use the context below to answer the question. Answer the question based only on the following context:",
        sources: []
      }
    }
  },
  ["bookRetrieval"],
  {
    revalidate: 3600
  }
)

// helper function
function formatCleanData(sources: Document[], amount: number, fileId: string) {
  return (
    sources
      .map(source => {
        return {
          pageContent: replaceSpecialChars(source.pageContent),
          metadata: source.metadata,
          page_number: source.metadata.page_number
        }
      })
      // remove duplicate page number
      .filter(
        (v, i, a) =>
          a.findIndex(
            t => t.metadata.page_number === v.metadata.page_number
          ) === i && v.metadata.file_id === fileId // Idk why the supabase return other documents, so I filter it here
        // this is only temporary solution
      )
      // only get the first (amount) documents
      .slice(0, amount)
      // oder by page number
      .sort((a, b) => a.page_number - b.page_number)
    // format the data
  )
}
