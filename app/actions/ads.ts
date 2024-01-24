"use server"

export const getAdsAdzedek = async () => {
  const response = await fetch(
    `https://api.adzedek.com/fetch_ad_by_id/adzedekTest`,
    {
      headers: {
        "adzedek-api": process.env.ADZEDEK_API_KEY as string
      }
    }
  )

  if (!response.ok) {
    return {
      error: "Something went wrong"
    }
  }

  const data = await response.json()

  return {
    data
  }
}

export const clickAdsAdzedek = async (adId: string, userId: string) => {}
