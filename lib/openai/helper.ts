import { Document } from "@langchain/core/documents"
import type { Tool } from "ai"
import type { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import type { Subscription } from "@/types/types"
import {
  callingAcademic,
  callingDocument,
  callingGenerateImage,
  callingGetOnThisDay,
  callingGetSearchContent,
  callingGoogle,
  callingSolveMathProblem,
  callingWeather,
  callingWebsite,
  callingYoutube
} from "@/lib/openai/function"
import { listToolsChat } from "@/lib/openai/tools"
import {
  getUserDetailsAdmin,
  getUserSubscriptionAdmin
} from "@/lib/supabase/admin/users"
import { randomSelectWeighted, replaceSpecialChars } from "@/lib/utils"

// Define the models with their respective weights
const modelsForPremium = [
  { name: "gpt-4-0125-preview", weight: 0.5 },
  { name: "gpt-3.5-turbo-0125", weight: 0.5 }
]

// Function to determine which model to use based on the user's subscription
export const determineModelBasedOnSubscription = async (
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
      model: randomSelectWeighted(modelsForPremium),
      subscription,
      additionalTools: listToolsChat,
      isCostLimit
    }
  }

  return {
    model: "gpt-3.5-turbo-0125",
    subscription,
    additionalTools: listToolsChat, // for now, for experimentation free users can use some tools
    isCostLimit
  }
}

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
        pageContent: replaceSpecialChars(page.replace(/[\x00-\x1F\x7F]/g, "")),
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
  // Remove special characters and replace with underscores
  const safeTitle = replaceSpecialChars(prompt)

  if (safeTitle.length <= 50) {
    return safeTitle
  }

  // Find the last space before the 50-char limit to avoid word cuts.
  const lastSpaceIndex = safeTitle.substring(0, 50).lastIndexOf(" ")

  // If there's a space, we cut the prompt there. If not, it's chop-chop at 50 chars!
  return lastSpaceIndex > -1
    ? safeTitle.substring(0, lastSpaceIndex)
    : safeTitle.substring(0, 50)
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
  if (name === "google_search") {
    toolResponse.result = await callingGoogle(
      String(args.query),
      String(args.lang),
      String(args.dateRestrict)
    )
  }
  if (name === "youtube_videos") {
    toolResponse.result = await callingYoutube(String(args.query))
  }
  if (name === "get_academic_research") {
    toolResponse.result = await callingAcademic(String(args.query))
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
  if (name === "get_on_this_day") {
    toolResponse.result = await callingGetOnThisDay()
  }
  if (name === "search_wikipedia") {
    toolResponse.result = await callingGetSearchContent(
      String(args.lang),
      String(args.query)
    )
  }
  return toolResponse
}
