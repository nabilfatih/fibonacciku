import { unstable_cache as cache } from "next/cache"
import moment from "moment"

export const wikiFeedFeature = cache(
  async (lang = "en", date?: string) => {
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

      const data = await response.json()

      const finalData = {
        todayFeatureArticle: data?.tfa || {},
        mostReadArticles: data?.mostread || {},
        dailyFeatureImage: data?.image || {},
        todayNews: data?.news || [],
        onThisDay: data?.onthisday || []
      }

      return {
        type: "wiki",
        message:
          "Always show all the urls of results, but not full url, instead just the title of the article",
        results: finalData
      }
    } catch (error) {
      console.log("Wiki Feed Feature Error: ", error)
      return {
        type: "wiki",
        message: "Quota exceeded for searching Wiki",
        results: {}
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
        `https://api.wikimedia.org/core/v1/wikipedia/${lang}/search/page?q=${query}&limit=10`,
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

      const data = await response.json()

      const finalData = {
        searchResults: data?.pages || {}
      }

      return {
        type: "wiki",
        message:
          "Always show all the urls of results, but not full url, instead just the title",
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
