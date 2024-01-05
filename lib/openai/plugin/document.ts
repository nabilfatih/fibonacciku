import supabaseAdmin from "@/lib/supabase/admin";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { formatDocumentsAsString } from "langchain/util/document";

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
    similarityK: 20,
    keywordK: 20,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
    metadata: {
      user_id: userId,
      file_id: fileId,
    },
  });

  const results = await retriever.getRelevantDocuments(query);

  const content = formatDocumentsAsString(results);

  return {
    message: "The following documents were retrieved:",
    content: content,
  };
};
