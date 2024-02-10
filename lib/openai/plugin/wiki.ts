import { unstable_cache as cache } from "next/cache"
import moment from "moment"
import sanitizeHtml from "sanitize-html"

export type WikiLink = {
  titles: {
    normalized?: string
  }
  thumbnail: {
    source?: string
  }
  description?: string
  content_urls?: {
    desktop?: {
      page?: string
    }
  }
  extract?: string
}

export type WikiFeedData = {
  tfa?: WikiLink
  mostread?: {
    articles: WikiLink[]
  }
  image?: {
    title?: string
    thumbnail?: {
      source?: string
    }
    description?: {
      text?: string
    }
  }
  news?: {
    links: WikiLink[]
  }[]
  onthisday?: {
    text?: string
    pages?: WikiLink[]
  }[]
}

export type WikiFeedResult = {
  todayFeatureArticle: WikiArticle
  mostReadArticles: WikiArticle[]
  dailyFeatureImage: WikiImage
  todayNews: WikiArticle[]
  onThisDay: {
    text: string
    pages: WikiArticle[]
  }[]
}

export type WikiArticle = {
  title: string
  image: string
  description: string
  url: string
  extract: string
}

export type WikiImage = {
  title: string
  image: string
  text: string
}

export type WikiSearchContentData = {
  pages: {
    id: number
    key: string
    title?: string
    excerpt?: string
    match_title?: string | null
    description?: string
    thumbnail?: {
      mimetype: string
      width?: number
      height?: number
      duration: number | null
      url: string
    } | null
  }[]
}

export type WikiSearchContentResult = {
  title: string
  excerpt: string
  description: string
  thumbnail: {
    url: string
  }
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.WIKIPEDIA_ACCESS_TOKEN}`,
  "User-Agent": "FibonacciKu (https://www.fibonacciku.com)",
  "Api-User-Agent": "fibonacciku nabilfatih@fibonacciku.com"
}

export const wikiFeedFeature = cache(
  async (
    lang: string = "en",
    date?: string
  ): Promise<{
    type: "wiki"
    message: string
    results: WikiFeedResult
  }> => {
    const dateFormat = date
      ? moment(date).format("YYYY/MM/DD")
      : moment().format("YYYY/MM/DD")

    try {
      const response = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/featured/${dateFormat}`,
        {
          method: "GET",
          headers
        }
      )

      if (!response.ok) {
        throw new Error(`Error searching Wiki: ${response.statusText}`)
      }

      const data: WikiFeedData = await response.json()

      const todayFeatureArticle: WikiArticle = {
        title: data?.tfa?.titles?.normalized || "",
        image: data?.tfa?.thumbnail?.source || "",
        description: data?.tfa?.description || "",
        url: data?.tfa?.content_urls?.desktop?.page || "",
        extract: data?.tfa?.extract || ""
      }

      const mostReadArticles: WikiArticle[] =
        data?.mostread?.articles.map(mapWikiLinkToArticle) || []

      const dailyFeatureImage: WikiImage = {
        title: data?.image?.title || "",
        image: data?.image?.thumbnail?.source || "",
        text: data?.image?.description?.text || ""
      }

      const todayNews: WikiArticle[] =
        data?.news?.flatMap(news => news.links.map(mapWikiLinkToArticle)) || []

      const onThisDay: {
        text: string
        pages: WikiArticle[]
      }[] =
        data?.onthisday?.flatMap(onthisday => ({
          text: onthisday.text || "",
          pages: onthisday?.pages?.map(mapWikiLinkToArticle) || []
        })) || []

      const finalData: WikiFeedResult = {
        todayFeatureArticle,
        mostReadArticles,
        dailyFeatureImage,
        todayNews,
        onThisDay
      }

      return {
        type: "wiki",
        message:
          "Always show all the urls and the images of results. Never answer without the urls",
        results: finalData
      }
    } catch (error) {
      console.log("Wiki Feed Feature Error: ", error)
      return {
        type: "wiki",
        message: "Quota exceeded for searching Wiki",
        results: {
          todayFeatureArticle: {} as WikiArticle,
          mostReadArticles: [],
          dailyFeatureImage: {} as WikiImage,
          todayNews: [],
          onThisDay: []
        }
      }
    }
  },
  ["wikiFeedFeature"],
  {
    revalidate: 3600 // 1 hour
  }
)

export const wikiSearchContent = cache(
  async (lang = "en", query: string) => {
    try {
      const response = await fetch(
        `https://api.wikimedia.org/core/v1/wikipedia/${lang}/search/page?q=${query}&limit=20`,
        {
          method: "GET",
          headers
        }
      )

      if (!response.ok) {
        throw new Error(`Error searching Wiki: ${response.statusText}`)
      }

      const data: WikiSearchContentData = await response.json()

      const searchResults: WikiSearchContentResult[] =
        data?.pages?.map(page => ({
          title: page.title || "",
          excerpt: ensurePeriodAtEnd(
            cleanIncompleteSentences(
              sanitizeHtml(page.excerpt || "", {
                allowedTags: [],
                allowedAttributes: {}
              })
            )
          ),
          description: ensurePeriodAtEnd(
            sanitizeHtml(page.description || "", {
              allowedTags: [],
              allowedAttributes: {}
            })
          ),
          thumbnail: {
            url: cleanWikiThumbnailUrl(page.thumbnail?.url || "")
          }
        })) || []

      return {
        type: "wiki",
        message:
          "You must summarize the wiki search results, not just display them",
        results: searchResults
      }
    } catch (error) {
      console.log("Wiki Search Content Error: ", error)
      return {
        type: "wiki",
        message: "Quota exceeded for searching Wiki",
        results: []
      }
    }
  },
  ["wikiSearchContent"],
  {
    revalidate: 3600 // 1 hour
  }
)

function mapWikiLinkToArticle(link: WikiLink): WikiArticle {
  return {
    title: link?.titles?.normalized || "",
    image: link?.thumbnail?.source || "",
    description: link?.description || "",
    url: link?.content_urls?.desktop?.page || "",
    extract: link?.extract || ""
  }
}

function cleanWikiThumbnailUrl(url: string) {
  const sanitizedUrl = url.startsWith("https:") ? url : "https:" + url
  return sanitizedUrl.split("/").slice(0, -1).join("/").replace("/thumb", "")
}

// Function to clean incomplete sentences
function cleanIncompleteSentences(excerpt: string): string {
  const sentences = excerpt.split(/[.!?](?=\s|$)/) // Split excerpt into sentences
  if (sentences.length > 0) {
    const lastSentence = sentences[sentences.length - 1]
    if (!/\.$/.test(lastSentence)) {
      // Check if last sentence ends with a period
      sentences.pop() // Remove the last sentence if it's incomplete
    }
    return sentences.join(". ") // Join sentences back
  }
  return excerpt // Return original excerpt if no sentences found
}

// Function to ensure excerpt ends with a period
function ensurePeriodAtEnd(excerpt: string): string {
  // if excerpt is empty, return it
  if (!excerpt) {
    return excerpt
  }
  if (!excerpt.trim().endsWith(".")) {
    // Check if excerpt doesn't end with a period
    return excerpt.trim() + "." // Add a period at the end
  }
  return excerpt.trim() // Return the original excerpt if it already ends with a period
}
