import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { track } from "@vercel/analytics/server"
import { kv } from "@vercel/kv"
import OpenAI from "openai"

import { openai } from "@/lib/openai"
import { createClientServer } from "@/lib/supabase/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
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
    await track("Error - AI Speech", {
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

  const { text } = (await req.json()) as {
    text: string
  }

  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }

  const userId = user.id

  try {
    // Set up the headers for streaming audio
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text
    })

    // Check if the response has a body (ReadableStream)
    if (response.body) {
      // Set the headers for streaming
      const headers = new Headers()
      headers.set("Content-Type", "audio/mpeg")

      // Create a TransformStream to handle the streaming
      const { readable, writable } = new TransformStream()

      // Start processing the stream
      response.body.pipeTo(writable)

      // Return a new Response with the readable side of the TransformStream
      return new Response(readable, { headers })
    } else {
      throw new Error("No response body")
    }
  } catch (error: any) {
    console.error(`Error - Internal Server Error: ${error}`)
    await track("Error - AI Speech", {
      data: `${userId} - ${error.message || "High Traffic"}`
    })
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json(
        {
          error: {
            name,
            status,
            headers,
            message: "High Traffic",
            text: message
          }
        },
        { status }
      )
    } else {
      return NextResponse.json(
        {
          error: {
            message: "High Traffic"
          }
        },
        { status: 500 }
      )
    }
  }
}
