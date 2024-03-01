import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { track } from "@vercel/analytics/server"
import { kv } from "@vercel/kv"

import { AppId, extractDataFromXML } from "@/lib/openai/plugin/wolframalpha"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")
  const ratelimit = new Ratelimit({
    redis: kv,
    // rate limit to 5 requests per 10 seconds
    limiter: Ratelimit.slidingWindow(5, "10s")
  })

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  )

  if (!success) {
    await track("Error - AI Plugin Wolframalpha", {
      data: `${ip} - Rate Limit Exceeded`
    })
    return NextResponse.json(
      {
        error: {
          statusCode: 429,
          message: "Too Many Requests"
        }
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString()
        }
      }
    )
  }

  const { query } = (await req.json()) as { query: string }

  try {
    const response = await fetch(
      `https://api.wolframalpha.com/v2/query?input=${query}&appid=${AppId}&podstate=Result__Step-by-step%20solution&format=plaintext`
    )
    if (!response.ok) {
      throw new Error(`Error searching WolframAlpha: ${response.statusText}`)
    }
    const xml = await response.text()
    const data = extractDataFromXML(xml)
    return NextResponse.json(data)
  } catch (error) {
    console.log("WolframAlpha Error: ", error)
    return NextResponse.json({
      error: {
        statusCode: 429,
        message: "Quota exceeded for searching WolframAlpha"
      }
    })
  }
}
