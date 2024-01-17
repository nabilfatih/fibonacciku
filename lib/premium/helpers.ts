import type { Geo } from "@vercel/edge"
import axios from "axios"

import { countriesList } from "@/lib/data/countries"
import type {
  CurrencyType,
  PlanDetailsType,
  PlanType,
  PriceListType
} from "@/lib/premium/type"

export const planOptions: PlanType[] = ["premium"]

export const planDetails: PlanDetailsType = {
  premium: [
    "all-features-in-hobby",
    "you-can-do-anything",
    "download-book",
    "image-analysis",
    "image-generation",
    "gpt-4-support",
    "priority-access",
    "dedicated-support"
  ]
}

export const priceList: PriceListType = [
  {
    plan: "premium",
    type: "monthly",
    redirect: false,
    priceId: "price_1O4h0CApEKbNyVi6Tf1DTZGV",
    price: {
      usd: 18,
      eur: 18,
      idr: 200000
    }
  },
  {
    plan: "premium",
    type: "yearly",
    redirect: false,
    priceId: "price_1OX6qLApEKbNyVi6E1uDd5Cp",
    price: {
      usd: 180,
      eur: 180,
      idr: 2000000
    }
  }
]

// Helper function to get price based on plan and currency
export const getPrice = (
  plan: PlanType,
  currency: CurrencyType,
  type: "monthly" | "yearly"
): number => {
  const planDetails = priceList.find(p => p.plan === plan && p.type === type)
  return planDetails ? planDetails.price[currency] : 0
}

// Helper functions
export const formatCurrency = (
  amount: number,
  currency: string,
  type: "monthly" | "yearly"
): string => {
  if (currency === "idr") {
    // Convert to 'K' format for IDR
    const amountInK = Math.round(amount / 1000)
    return `IDR ${amountInK}K`
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0
    }).format(amount)
  }
}

export const validCurrencies = ["usd", "eur", "idr"]

export const getUserCurrency = async (): Promise<CurrencyType> => {
  const { data } = await axios.get("/api/info/location")
  if (!data) return "usd"
  const location: Geo = data.location
  const countryCode = location.country
  if (!countryCode) return "usd"
  const countryInfo = countriesList.find(
    country => country.cca2.toLowerCase() === countryCode.toLowerCase()
  )
  if (!countryInfo) return "usd"
  const currency: CurrencyType = Object.keys(
    countryInfo.currencies
  )[0].toLowerCase() as CurrencyType
  return validCurrencies.includes(currency) ? currency : "usd"
}
