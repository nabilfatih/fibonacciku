import { generateImage } from "./plugin/ai"
import { documentRetrieval } from "./plugin/retrieval"
import { academicPlugin, googlePlugin, youtubePlugin } from "./plugin/internet"
import { scrapeWebsite } from "./plugin/ninja"
import { weatherPlugin } from "./plugin/weather"
import { wolframalphaPlugin } from "./plugin/wolframalpha"

export type PluginResponse = {
  type: string
  message: string
  results: any
}

export const callingSolveMathProblem = async (query: string) => {
  const data = await wolframalphaPlugin(query)
  return data
}

export const callingGoogleYoutubeAcademic = async (
  type: string,
  query: string
): Promise<{ results: PluginResponse[] | string }> => {
  // Remove space in type and split by comma
  const typeArray = type.replace(/\s/g, "").split(",")

  // Create an array of promises based on the types provided
  const promises = typeArray.map(async pluginType => {
    switch (pluginType) {
      case "google":
        return await googlePlugin(query).then(data => data)
      case "youtube":
        return await youtubePlugin(query).then(data => data)
      case "academic":
        return await academicPlugin(query).then(data => data)
      default:
        return Promise.resolve(undefined)
    }
  })

  // Filter out any undefined results from promises that did not match a case
  const validPromises = promises.filter(promise => promise !== undefined)

  // Execute all promises in parallel using Promise.all
  const results = await Promise.all(validPromises)

  // Filter out any undefined results after promises have resolved
  const finalResults = results.filter(
    result => result !== undefined
  ) as PluginResponse[]

  return {
    results: finalResults.length > 0 ? finalResults : "No results found."
  }
}

export const callingWeather = async (location: string) => {
  const data = await weatherPlugin(location)
  return data
}

export const callingWebsite = async (url: string) => {
  const data = await scrapeWebsite(url)
  return data
}

export const callingGenerateImage = async (
  userId: string,
  chatId: string,
  prompt: string,
  size: string
) => {
  const data = await generateImage(
    userId,
    chatId,
    prompt,
    size as "1024x1792" | "1024x1024" | "1792x1024"
  )
  return data
}

export const callingDocument = async (
  userId: string,
  fileId: string,
  query: string
) => {
  const data = await documentRetrieval(userId, fileId, query)
  return data
}
