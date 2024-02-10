import { unstable_cache as cache } from "next/cache"
import sanitizeHtml from "sanitize-html"

import type {
  AcademicSearchResult,
  SearchResult,
  YoutubeSearchResult
} from "@/types/types"

export const googlePlugin = cache(
  async (query: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${query}&num=8&safe=active`
      )
      if (!response.ok) {
        throw new Error(`Error searching Google: ${response.statusText}`)
      }
      const data = await response.json()
      const result = data.items

      const smallData: SearchResult[] = result.map((item: any) => {
        return {
          title: item.title,
          displayLink: item.displayLink,
          link: item.link,
          snippet: item.snippet || ""
        }
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
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&maxResults=8&q=${query}&type=video&order=relevance`
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
        `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=8&fields=corpusId,url,title,year,authors,abstract,openAccessPdf,publicationDate,journal,citationStyles,tldr`,
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
