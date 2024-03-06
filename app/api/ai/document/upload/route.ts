import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { track } from "@vercel/analytics/server"
import { kv } from "@vercel/kv"

import {
  EDEN_HEADERS,
  ENDPOINTS,
  WEBHOOK_RECEIVER_DOCUMENT
} from "@/lib/openai/plugin/ai"
import { getChatDocumentSignedUrlAdmin } from "@/lib/supabase/admin/chat"
import { insertLibraryAdmin } from "@/lib/supabase/admin/library"
import { createClientServer } from "@/lib/supabase/server"
import { generateUUID } from "@/lib/utils"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

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
    await track("Error - AI Document Upload", {
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

  const { fileId, fileName, fileType } = (await req.json()) as {
    fileId: string
    fileName: string
    fileType: string
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
    const publicUrl = await getChatDocumentSignedUrlAdmin(userId, fileId)

    const libraryId = generateUUID()

    // Always check the price of the providers please! It can be there is a change in the price
    // See EDEN AI Pricing
    const response = await fetch(ENDPOINTS.ocrAsync, {
      method: "POST",
      headers: EDEN_HEADERS,
      body: JSON.stringify({
        show_original_response: false,
        fallback_providers: "microsoft",
        providers: "amazon",
        file_url: publicUrl,
        users_webhook_parameters: {
          userId: userId,
          fileId: fileId,
          libraryId: libraryId,
          fileName: fileName
        },
        webhook_receiver: WEBHOOK_RECEIVER_DOCUMENT
      })
    })

    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    const publicId: string = data.public_id

    // insert into database libraries
    await insertLibraryAdmin(
      userId,
      fileId,
      libraryId,
      fileName,
      fileType,
      publicId
    )

    // For Logging
    console.log(
      `Document uploaded successfully - ${userId} - ${fileId} - ${libraryId} - ${publicId} - ${WEBHOOK_RECEIVER_DOCUMENT}`
    )

    return NextResponse.json(
      {
        message: "Success"
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(error)
    await track("Error - Upload Document", {
      data: `${userId} - ${error.message || "High Traffic"} - ${fileId}`
    })
    return NextResponse.json(
      { error: { statusCode: 500, message: "High Traffic" } },
      { status: 500 }
    )
  }
}
