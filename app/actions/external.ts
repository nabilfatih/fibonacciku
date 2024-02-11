"use server"

import type { NasaAstronomyPictureOfTheDay } from "@/types/types"
import { wikiFeedFeature } from "@/lib/openai/plugin/wiki"

export async function getWikiFeedFeature(lang = "en") {
  const wikiResults = await wikiFeedFeature(lang)

  // check if the wikiResults.results is an empty object
  if (Object.keys(wikiResults.results).length === 0) {
    return null
  }

  return wikiResults.results
}

export async function getAstronomyPictureOfTheDay(count = 3) {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&count=${count}`
  )
  if (!response.ok) {
    return {
      error: "Failed to fetch data"
    }
  }
  const data = await response.json()
  return {
    data: data as NasaAstronomyPictureOfTheDay[]
  }
}
