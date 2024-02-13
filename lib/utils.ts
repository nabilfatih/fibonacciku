import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"

import { priceList } from "@/lib/premium/helpers"
import type { CurrencyType } from "@/lib/premium/type"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  return url
}

export const postData = async ({
  url,
  data
}: {
  url: string
  data?: {
    price: (typeof priceList)[0]
    currency: CurrencyType
    quantity: number
  }
}) => {
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    console.error("Error in postData", { url, data, res })

    throw Error(res.statusText)
  }

  return res.json()
}

export const getGeoLocation = async () => {
  const { data } = await axios.get("https://geolocation-db.com/json/")
  return data
}

export const getIp = async () => {
  const { data } = await axios.get("/api/info/ip")
  return data.ip
}

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z") // Unix epoch start.
  t.setSeconds(secs)
  return t
}

export const capitalizeFirstLetter = (word: string) => {
  var splitStr = word.toLowerCase().split(" ")
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  // Directly return the joined string
  return splitStr.join(" ")
}

export const capitalizeOnlyFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const getCurrentDate = () => {
  return new Date().toISOString()
}

export const generateUUID = () => {
  return uuidv4()
}

export const generateNanoID = (number = 21) => {
  return uuidv4().split("-").join("").substring(0, number)
}

export const replaceDelimiters = (markdown: string): string => {
  // only use $$ and $ for math (dollar sign)
  // replace all other delimiters with $$ and $ for math
  return (
    markdown
      .replace(/\\\[([\s\S]*?)\\\]/g, "$$$1$$")
      .replace(/\\\(([\s\S]*?)\\\)/g, "$$$1$$")
      // if there is newline before =, then remove the newline
      .replace(/\n=/g, "=")
  )
}

export const truncateParagraph = (
  paragraph: string,
  maxSentences: number
): string => {
  // Split the paragraph into an array of sentences
  const sentences = paragraph.split(".")

  // Trim any empty strings from the array
  const trimmedSentences = sentences.filter(sentence => sentence.trim() !== "")

  // Return the original paragraph if it contains fewer sentences than the maximum
  if (trimmedSentences.length <= maxSentences) {
    return paragraph
  }

  // Otherwise, join the first maxSentences sentences and return
  return trimmedSentences.slice(0, maxSentences).join(". ") + "."
}

export const randomSelect = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}
