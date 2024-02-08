import type { ImageResult } from "@/types/types"
import {
  getChatImagePublicUrlAdmin,
  uploadChatImageAdmin
} from "@/lib/supabase/admin/chat"
import {
  getUserDetailsAdmin,
  getUserSubscriptionAdmin,
  updateUserUsageAdmin
} from "@/lib/supabase/admin/users"

import { openai } from ".."

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms))

export const EDEN_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${process.env.EDENAI_API_KEY}`
}

export const EDEN_URL = "https://api.edenai.run/v2"
export const ENDPOINTS = {
  ocr: `${EDEN_URL}/ocr/ocr`,
  objectDetection: `${EDEN_URL}/image/object_detection`,
  ocrAsync: `${EDEN_URL}/ocr/ocr_async`
}
export const WEBHOOK_RECEIVER_DOCUMENT = `https://www.fibonacciku.com/api/ai/document/webhooks`

type FetchDataProps = {
  provider: string
  apiUrl: string
  publicUrl: string
}

const fetchData = async ({ provider, apiUrl, publicUrl }: FetchDataProps) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: EDEN_HEADERS,
      body: JSON.stringify({
        show_original_response: false,
        fallback_providers: "",
        providers: provider,
        language: "auto-detect",
        file_url: publicUrl
      })
    })

    if (!response.ok) throw new Error(response.statusText)
    return (await response.json())[provider]
  } catch (error) {
    console.error(`Error Fetching Eden AI: ${error}`)
    return null
  }
}

export const ocrDocument = async (publicUrl: string): Promise<string[]> => {
  try {
    const responseLaunch = await fetch(ENDPOINTS.ocrAsync, {
      method: "POST",
      headers: EDEN_HEADERS,
      body: JSON.stringify({
        show_original_response: false,
        fallback_providers: "",
        providers: "amazon",
        file_url: publicUrl
      })
    })

    if (!responseLaunch.ok) throw new Error(responseLaunch.statusText)
    const dataLaunch = await responseLaunch.json()
    const publicId: string = dataLaunch.public_id

    let finalData
    while (true) {
      await sleep(2500) // Sleep for 2.5 seconds
      const responseStatus = await fetch(`${ENDPOINTS.ocrAsync}/${publicId}`, {
        method: "GET",
        headers: EDEN_HEADERS
      })
      if (!responseStatus.ok) throw new Error(responseStatus.statusText)
      const dataStatus = await responseStatus.json()
      if (dataStatus.status === "finished") {
        finalData = dataStatus.results.amazon.pages
        break
      }
    }
    return finalData.map((data: any) =>
      data.lines.map((line: any) => line.text).join(" ")
    )
  } catch (error) {
    console.error(`Error Fetching Eden AI: ${error}`)
    return []
  }
}

export const generateImage = async (
  userId: string,
  chatId: string,
  prompt: string,
  size: "1024x1792" | "1024x1024" | "1792x1024"
): Promise<{
  message: string
  images: ImageResult[]
}> => {
  // if size is not the correct value, then set it to 1024x1024
  const validSizes = new Set(["1024x1024", "1024x1792", "1792x1024"])
  if (!validSizes.has(size)) {
    size = "1024x1024"
  }

  try {
    const [userDetails, subscription] = await Promise.all([
      getUserDetailsAdmin(userId),
      getUserSubscriptionAdmin(userId)
    ])
    // if the user has reached the traffic limit, return a message
    if (!subscription && userDetails.usage > 50) {
      return {
        message:
          "The user has reached the traffic limit, please consider to buy a premium plan.",
        images: []
      }
    }

    // generate 4 image in parallel,
    const imagePromises = new Array(4).fill(null).map(async () => {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        style: "vivid",
        size,
        response_format: "b64_json",
        user: userId
      })

      const image = imageResponse.data[0]

      // in parallel, upload and update user usage
      const [dataFile] = await Promise.all([
        uploadChatImageAdmin(userId, chatId, String(image.b64_json)),
        updateUserUsageAdmin(userId, 10) // generate image cost 5 usage
      ])

      const url = getChatImagePublicUrlAdmin(userId, chatId, dataFile.fileId)

      return {
        prompt: image.revised_prompt || prompt,
        image: url
      }
    })

    const finalData = await Promise.all(imagePromises)

    return {
      message:
        "Describe very shortly the image using one of the prompt, no need to show the image as it is already shown in the UI metadata.",
      images: finalData
    }
  } catch (error: any) {
    console.error(`Error Fetching OpenAI: ${error}`)
    return {
      message: "Cannot generate image, traffic limit exceeded.",
      images: []
    }
  }
}
