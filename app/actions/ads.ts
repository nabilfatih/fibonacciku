"use server"

import { unstable_noStore as noStore } from "next/cache"

export const getAdsAdzedek = async () => {
  noStore()
  const response = await fetch(
    "https://api.adzedek.com/fetch_ad_to_show/Nabil",
    {
      headers: {
        "adzedek-api": process.env.ADZEDEK_API_KEY as string
      }
    }
  )

  if (!response.ok) {
    return {
      statusCode: response.status,
      error: "Something went wrong"
    }
  }

  const data = await response.json()

  return {
    data
  }
}

export const getAdsInfo = async (adId: string) => {
  const response = await fetch(
    `https://api.adzedek.com/get_ad_info_by_id/${adId}`,
    {
      headers: {
        "adzedek-api": process.env.ADZEDEK_API_KEY as string
      }
    }
  )

  if (!response.ok) {
    return {
      statusCode: response.status,
      error: "Something went wrong"
    }
  }

  const data = await response.json()

  return {
    data
  }
}

export const clickAdsAdzedek = async (adId: string, userId: string) => {
  const response = await fetch("https://api.adzedek.com/record_user_click", {
    method: "POST",
    headers: {
      "adzedek-api": process.env.ADZEDEK_API_KEY as string,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ad_id: adId,
      user_id: userId
    })
  })

  if (!response.ok) {
    return {
      statusCode: response.status,
      error: "Something went wrong"
    }
  }

  // response is not json
  const data = await response.text()

  return {
    data
  }
}
