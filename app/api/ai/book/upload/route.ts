import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"

import { EDEN_HEADERS, ENDPOINTS } from "@/lib/openai/plugin/ai"
import {
  getBooksSignedUrlAdmin,
  insertBooksAdmin
} from "@/lib/supabase/admin/book"
import { createClientServer } from "@/lib/supabase/server"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

export async function POST(req: NextRequest) {
  const { bookId, fileId, dataBook } = (await req.json()) as {
    bookId: string
    fileId: string
    dataBook: {
      title: string
      authors: string
      publisher: string
      isbn: string
      abstract: string
      publishedDate: string
      tags: string
      type: string
      lang: string
      collection: string
    }
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

  try {
    const publicUrl = await getBooksSignedUrlAdmin(bookId, fileId)

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
          bookId: bookId,
          fileId: fileId
        },
        webhook_receiver: "https://www.fibonacciku.com/api/ai/book/webhooks"
      })
    })

    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    const publicId: string = data.public_id

    // Insert book into database
    await insertBooksAdmin(bookId, fileId, publicId, dataBook)

    // For Logging
    console.log(
      `Books uploaded successfully - ${bookId} - ${fileId} - ${bookId} - ${publicId}`
    )

    return NextResponse.json(
      {
        message: "Success"
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(error)
    await track("Error - Upload Book", {
      data: `${bookId} - ${error.message || "High Traffic"}`
    })
    return NextResponse.json(
      { error: { statusCode: 500, message: "High Traffic" } },
      { status: 500 }
    )
  }
}
