import { unstable_cache as cache } from "next/cache"
import moment from "moment"

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

export type WikiSearchContent = {
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.WIKIPEDIA_ACCESS_TOKEN}`,
            "Api-User-Agent": "fibonacciku nabilakbarazzima@gmail.com"
          }
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.WIKIPEDIA_ACCESS_TOKEN}`,
            "Api-User-Agent": "fibonacciku nabilakbarazzima@gmail.com"
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error searching Wiki: ${response.statusText}`)
      }

      const data: WikiSearchContent = await response.json()

      const searchResults =
        data?.pages?.map(page => ({
          title: page.title || "",
          excerpt: page.excerpt || "",
          description: page.description || "",
          thumbnail: {
            url: cleanWikiThumbnailUrl(page.thumbnail?.url || "")
          }
        })) || []

      const finalData = {
        searchResults: searchResults
      }

      return {
        type: "wiki",
        message:
          "Always show all the urls and the images of results. Never answer without the urls",
        results: finalData
      }
    } catch (error) {
      console.log("Wiki Search Content Error: ", error)
      return {
        type: "wiki",
        message: "Quota exceeded for searching Wiki",
        results: {}
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
