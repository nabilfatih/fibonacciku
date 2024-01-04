import { getUserSubscriptionAdmin } from "@/lib/supabase/admin/users";
import type { Subscription } from "@/types/types";
import { listToolsChat } from "@/lib/openai/tools";
import type { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import type { Tool } from "ai";

// Function to determine which model to use based on the user's subscription
export const determineModelBasedOnSubscription = async (
  userId: string
): Promise<{
  model: string;
  subscription: Subscription | null;
  additionalTools: Tool[];
}> => {
  // Retrieve the user's subscription details
  const subscription = await getUserSubscriptionAdmin(userId);

  // Default model for non-subscribers or basic plans
  const defaultModel = "gpt-3.5-turbo-1106";
  // Model for premium or enterprise subscribers
  const premiumModel = "gpt-4-1106-preview";

  // Determine the model based on the subscription plan
  if (
    subscription &&
    (subscription.planName === "premium" ||
      subscription.planName === "enterprise")
  ) {
    return {
      model: premiumModel,
      subscription,
      additionalTools: listToolsChat,
    };
  }

  return { model: defaultModel, subscription, additionalTools: [] };
};

// Function to create documents from pages
export const createDocumentsFromPages = async (
  pages: string[],
  textSplitter: RecursiveCharacterTextSplitter,
  metadata: any
): Promise<Document[]> => {
  const docs: Document[] = [];
  // Loop over the pages and split the documents
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const doc = await textSplitter.splitDocuments([
      new Document({
        pageContent: page.replace(/[\x00-\x1F\x7F]/g, ""),
        metadata: {
          ...metadata,
          page_number: i + 1,
        },
      }),
    ]);
    docs.push(...doc);
  }
  return docs;
};

export const createSafeTitle = (prompt: string): string => {
  if (prompt.length <= 50) {
    return prompt; // If it's short and sweet, just use it as is.
  }

  // Find the last space before the 50-char limit to avoid word cuts.
  const lastSpaceIndex = prompt.substring(0, 50).lastIndexOf(" ");

  // If there's a space, we cut the prompt there. If not, it's chop-chop at 50 chars!
  return lastSpaceIndex > -1
    ? prompt.substring(0, lastSpaceIndex)
    : prompt.substring(0, 50);
};
