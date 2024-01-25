"use server"

export const getAdsAdzedek = async () => {
  const response = await fetch(
    `https://api.adzedek.com/get_ad_info_by_id/adzedekTest`,
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

export const clickAdsAdzedek = async (adId: string, userId: string) => {
  const response = await fetch("https://api.adzedek.com/record_user_click", {
    method: "POST",
    body: JSON.stringify({
      ad_id: adId,
      user_id: userId
    }),
    headers: {
      "adzedek-api": process.env.ADZEDEK_API_KEY as string
    }
  })

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
