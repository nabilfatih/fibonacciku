import { unstable_cache as cache } from "next/cache"
import sanitizeHtml from "sanitize-html"

import type {
  AcademicSearchResult,
  SearchResult,
  YoutubeSearchResult
} from "@/types/types"

import { scrapeWebsite } from "./ninja"

export const fetchGoogleSearch = async (query: string, num: number) => {
  // it can handle multiple fetch at time in parallel
  // google can only return 10 results at a time, so we need to fetch multiple times
  // if num = 15, then we need to fetch 2 times, first time 10 results and second time 5 results
  // if num = 5, then we need to fetch 1 time, 5 results
  try {
    const responses = await Promise.all(
      Array.from({ length: Math.ceil(num / 10) }, (_, i) => {
        const start = i * 10 + 1 // why? because google start from 1, and then 11, 21, 31, etc
        return fetch(
          `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${query}&num=10&start=${start}&safe=active`
        )
      })
    )
    const results = await Promise.all(
      responses.map(async response => {
        if (!response.ok) {
          throw new Error(`Error searching Google: ${response.statusText}`)
        }
        const data = await response.json()
        return data.items
      })
    )
    const result = results.flat().slice(0, num)
    return result
  } catch (error) {
    throw new Error(`Error searching Google: ${error}`)
  }
}

export const googlePlugin = cache(
  async (query: string) => {
    try {
      const result = await fetchGoogleSearch(query, 20)

      const smallData: SearchResult[] = result.map((item: any) => {
        return {
          title: item.title,
          displayLink: item.displayLink,
          link: item.link,
          snippet: item.snippet || ""
        }
      })

      // scrape the first 2 links, and then put it in as content: "..."
      const content = await Promise.all(
        result.slice(0, 2).map(async (item: any) => {
          const scraped = await scrapeWebsite(item.link)
          return scraped.data
        })
      )

      // put the content into the smallData
      smallData.forEach((item, index) => {
        item.content = content[index]
      })

      return {
        type: "google",
        message:
          "You must summarize the google search results, not just display them",
        results: smallData
      }
    } catch (error) {
      console.log("Google Search Error: ", error)
      return {
        type: "google",
        message: "Quota exceeded for searching Google",
        results: []
      }
    }
  },
  ["googlePlugin"],
  {
    revalidate: 3600
  }
)

export const youtubePlugin = cache(
  async (query: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&maxResults=14&q=${query}&type=video&order=relevance`
      )
      if (!response.ok) {
        throw new Error(`Error searching Youtube: ${response.statusText}`)
      }
      const data = await response.json()
      const result = data.items

      const smallData: YoutubeSearchResult[] = result.map((item: any) => {
        return {
          id: {
            videoId: item.id.videoId,
            channelId: item.snippet.channelId
          },
          snippet: {
            thumbnails: {
              high: {
                url: item.snippet.thumbnails.high.url
              }
            },
            title: item.snippet.title,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle
          }
        }
      })

      return {
        type: "youtube",
        message:
          "You must summarize the youtube search results, not just display them",
        results: smallData
      }
    } catch (error) {
      console.log("Youtube Error: ", error)
      return {
        type: "youtube",
        message: "Quota exceeded for searching Youtube",
        results: []
      }
    }
  },
  ["youtubePlugin"],
  {
    revalidate: 3600
  }
)

export const academicPlugin = cache(
  async (query: string) => {
    try {
      // API key needs to be sent in the header of the request as x-api-key
      const apiKey = process.env.SEMANTIC_API_KEY
      if (!apiKey) throw new Error("No API key found")
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=14&fields=corpusId,url,title,year,authors,abstract,openAccessPdf,publicationDate,journal,citationStyles,tldr`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
          }
        }
      )
      if (!response.ok) {
        throw new Error(`Error searching Academic: ${response.statusText}`)
      }
      const data = await response.json()
      const result = data.data

      const smallData: AcademicSearchResult[] = result.map((item: any) => {
        return {
          id: item.paperId,
          title: item.title,
          authors:
            item.authors?.map((author: any) => {
              return {
                name: author.name
              }
            }) || [],
          year: item.year,
          abstract: sanitizeHtml(item?.abstract || "", {
            allowedTags: [],
            allowedAttributes: {}
          }),
          tldr: sanitizeHtml(item?.tldr?.text || "", {
            allowedTags: [],
            allowedAttributes: {}
          }),
          url: item.url
        }
      })

      return {
        type: "academic",
        message:
          "You must summarize the academic search results, not just display them",
        results: smallData
      }
    } catch (error) {
      console.log("Academic Research Error: ", error)
      return {
        type: "academic",
        message: "Academic research not found",
        results: []
      }
    }
  },
  ["academicPlugin"],
  {
    revalidate: 3600
  }
)
