import { unstable_cache as cache } from "next/cache"
import { Document } from "@langchain/core/documents"
import type { Tool } from "ai"
import type { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import type { Subscription } from "@/types/types"
import {
  callingDocument,
  callingGenerateImage,
  callingGoogleYoutubeAcademic,
  callingSolveMathProblem,
  callingWeather,
  callingWebsite
} from "@/lib/openai/function"
import { listToolsChat } from "@/lib/openai/tools"
import {
  getUserDetailsAdmin,
  getUserSubscriptionAdmin
} from "@/lib/supabase/admin/users"

// Function to determine which model to use based on the user's subscription
export const determineModelBasedOnSubscription = cache(
  async (
    userId: string
  ): Promise<{
    model: string
    subscription: Subscription | null
    additionalTools: Tool[]
    isCostLimit?: boolean
  }> => {
    // Retrieve the user's subscription details
    const [userDetails, subscription] = await Promise.all([
      getUserDetailsAdmin(userId),
      getUserSubscriptionAdmin(userId)
    ])

    // Default model for non-subscribers or basic plans
    const defaultModel = "gpt-3.5-turbo-1106"
    // Model for premium or enterprise subscribers
    // const premiumModel = "gpt-4-1106-preview";
    const premiumModel = "gpt-3.5-turbo-1106" // for now, for cost reasons

    // TODO: This is only when the cost reaches a certain threshold, this can be adjusted
    let isCostLimit = false
    // Now no limit, cause we have ads and we want to encourage people to use the app
    // if (!subscription && userDetails.usage > 50) {
    //   isCostLimit = true
    // }

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
        isCostLimit
      }
    }

    return {
      model: defaultModel,
      subscription,
      additionalTools: [],
      isCostLimit
    }
  },
  ["determineModelBasedOnSubscription"], // cache key
  {
    revalidate: 3600
  }
)

// Function to create documents from pages
export const createDocumentsFromPages = async (
  pages: string[],
  textSplitter: RecursiveCharacterTextSplitter,
  metadata: any
): Promise<Document[]> => {
  const docs: Document[] = []
  // Loop over the pages and split the documents
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const doc = await textSplitter.splitDocuments([
      new Document({
        pageContent: page.replace(/[\x00-\x1F\x7F]/g, ""),
        metadata: {
          ...metadata,
          page_number: i + 1
        }
      })
    ])
    docs.push(...doc)
  }
  return docs
}

export const createSafeTitle = (prompt: string): string => {
  if (prompt.length <= 50) {
    return prompt // If it's short and sweet, just use it as is.
  }

  // Find the last space before the 50-char limit to avoid word cuts.
  const lastSpaceIndex = prompt.substring(0, 50).lastIndexOf(" ")

  // If there's a space, we cut the prompt there. If not, it's chop-chop at 50 chars!
  return lastSpaceIndex > -1
    ? prompt.substring(0, lastSpaceIndex)
    : prompt.substring(0, 50)
}

export const callTools = async (
  userId: string,
  chatId: string,
  name: string,
  args: Record<string, unknown>,
  fileId = ""
): Promise<{ result: any }> => {
  const toolResponse = {
    result: {}
  }
  if (name === "ask_mathematics_question") {
    toolResponse.result = await callingSolveMathProblem(String(args.query))
  }
  if (name === "get_links_or_videos_or_academic_research") {
    toolResponse.result = await callingGoogleYoutubeAcademic(
      String(args.type),
      String(args.query)
    )
  }
  if (name === "get_website_information") {
    toolResponse.result = await callingWebsite(String(args.url))
  }
  if (name === "get_weather_information") {
    toolResponse.result = await callingWeather(String(args.location))
  }
  if (name === "create_image") {
    toolResponse.result = await callingGenerateImage(
      userId,
      chatId,
      String(args.prompt),
      String(args.size)
    )
  }
  if (name === "get_document") {
    toolResponse.result = await callingDocument(
      userId,
      fileId,
      String(args.query)
    )
  }
  return toolResponse
}
