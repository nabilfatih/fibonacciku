import supabaseAdmin from "@/lib/supabase/admin";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";

export const documentRetrieval = async (
  userId: string,
  fileId: string,
  query: string
) => {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabaseAdmin,
    similarityK: 10,
    keywordK: 10,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
    metadata: {
      file_id: fileId,
      user_id: userId,
    },
  });

  const results = await retriever.getRelevantDocuments(query);

  const cleanData = results
    .slice(0, 7)
    .map(doc => {
      return {
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        page_number: doc.metadata.page_number,
      };
    })
    .filter(
      (v, i, a) =>
        a.findIndex(t => t.metadata.page_number === v.metadata.page_number) ===
        i
    )
    // oder by page number
    .sort((a, b) => a.page_number - b.page_number);

  return {
    message:
      "You're only allowed to use the documents below to answer the question. Answer the question based only on the following sources:",
    sources: cleanData,
  };
};
