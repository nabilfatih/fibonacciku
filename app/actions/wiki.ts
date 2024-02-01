"use server"

import { wikiFeedFeature } from "@/lib/openai/plugin/wiki"

export async function feedFeature(lang = "en") {
  const wikiResults = await wikiFeedFeature(lang)

  // check if the wikiResults.results is an empty object
  if (Object.keys(wikiResults.results).length === 0) {
    return null
  }

  return wikiResults.results
}
