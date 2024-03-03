import { unstable_cache as cache } from "next/cache"

import { generateNanoID } from "@/lib/utils"

export const ninjaBaseUrl = "https://api.api-ninjas.com/v1/"

export const fetchNinja = async (endpoint: string, query: string) => {
  const response = await fetch(ninjaBaseUrl + endpoint + "?" + query, {
    method: "GET",
    headers: {
      "X-Api-Key": process.env.NINJA_API_KEY!
    }
  })
  if (!response.ok) {
    throw new Error(`Error searching Ninja: ${response.statusText}`)
  }
  return await response.json()
}

export const scrapeWebsite = cache(
  async (
    url: string
  ): Promise<{
    message?: string
    results: { id: string; data: string }[]
  }> => {
    try {
      // use ninja api
      const response = await fetchNinja(
        "webscraper",
        `url=${url}&text_only=true`
      )
      const data = {
        id: generateNanoID(5),
        ...response
      }
      return {
        results: [data]
      }
    } catch (error) {
      return {
        message: "Sorry but I can't get the information from that website.",
        results: []
      }
    }
  },
  ["scrapeWebsite"],
  {
    revalidate: 86400
  }
)
