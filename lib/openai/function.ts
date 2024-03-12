import { createFlashcards, generateImage } from "./plugin/ai"
import { academicPlugin, googlePlugin, youtubePlugin } from "./plugin/internet"
import { scrapeWebsite } from "./plugin/ninja"
import { documentRetrieval } from "./plugin/retrieval"
import { weatherPlugin } from "./plugin/weather"
import { wikiFeedFeature, wikiSearchContent } from "./plugin/wiki"
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

export const callingGoogle = async (
  query: string,
  lang: string,
  dateRestrict: string
) => {
  const data = await googlePlugin(query, lang, dateRestrict)
  return data
}

export const callingYoutube = async (query: string) => {
  const data = await youtubePlugin(query)
  return data
}

export const callingAcademic = async (query: string) => {
  const data = await academicPlugin(query)
  return data
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

export const callingGetOnThisDay = async () => {
  const data = await wikiFeedFeature()

  let finalData = {
    ...data
  }

  // if the data.results is not an empty object
  if (Object.keys(data.results).length !== 0) {
    finalData = {
      ...data,
      results: {
        ...data.results,
        mostReadArticles: data.results.mostReadArticles.slice(0, 10),
        todayNews: data.results.todayNews.slice(0, 5),
        onThisDay: data.results.onThisDay.slice(0, 5).map(onThisDay => {
          return {
            text: onThisDay.text,
            pages: onThisDay.pages.slice(0, 5)
          }
        })
      }
    }
  }
  return finalData
}

export const callingGetSearchContent = async (lang: string, query: string) => {
  const data = await wikiSearchContent(lang, query)
  return data
}

export const callingCreateFlashcards = async (context: string) => {
  const data = await createFlashcards(context)
  return data
}
