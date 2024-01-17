import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { track } from "@vercel/analytics/server"
import { kv } from "@vercel/kv"
import {
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse
} from "ai"
import OpenAI from "openai"

import type { ChatRequest } from "@/lib/context/use-message"
import { openai } from "@/lib/openai"
import {
  callTools,
  createSafeTitle,
  determineModelBasedOnSubscription
} from "@/lib/openai/helper"
import { documentRule } from "@/lib/openai/system"
import { insertChatAdmin } from "@/lib/supabase/admin/chat"
import { getLibraryByFileIdAdmin } from "@/lib/supabase/admin/library"
import { updateUserUsageAdmin } from "@/lib/supabase/admin/users"
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
    await track("Error - AI Chat Document", {
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

  const {
    messages,
    options,
    data: dataRequest
  } = (await req.json()) as ChatRequest

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

  const chatId = dataRequest.chatId
  const userId = user.id
  const { model, isCostLimit } = await determineModelBasedOnSubscription(userId)

  if (isCostLimit) {
    // return that is in limit access, please consider to buy premium
    return NextResponse.json(
      {
        error: {
          statusCode: 402,
          message: "Limit access, please consider to buy premium"
        }
      },
      {
        status: 402
      }
    )
  }

  const functions = [
    {
      name: "get_document",
      description:
        "Get the document from the database. This is RAG retriever to get the document context.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "the query to get the document context. Must be a standalone question."
          }
        },
        required: ["query"]
      }
    }
  ]

  // make sure that message length is always max 15, never remove the first index
  // if more than 15, remove from index 1 until the total length is 15
  // This is for make sure there is no spike in cost of openai
  let finalMessage = [...messages] as OpenAI.ChatCompletionMessage[]
  if (finalMessage.length > 15) {
    const firstMessage = finalMessage[0]
    finalMessage = [firstMessage, ...finalMessage.slice(-14)]
  }

  // inject system message with additional rules
  finalMessage[0].content += documentRule
  // inject last message with additional rules
  finalMessage[finalMessage.length - 1].content += documentRule

  try {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages: finalMessage,
      temperature: 0.5,
      functions: functions,
      function_call: {
        name: "get_document"
      },
      user: userId
    })

    const data = new experimental_StreamData()
    const stream = OpenAIStream(response, {
      // Force tools choice still error in AI SDK
      // thankfully this is only for document feature so it only has 1 tool
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages
      ) => {
        const resultFunction = await callTools(
          userId,
          chatId,
          name,
          args,
          dataRequest.fileId
        )
        data.append({
          toolName: name,
          data: resultFunction.result
        })
        const newMessages = createFunctionCallMessages(resultFunction.result)
        return openai.chat.completions.create({
          messages: [...(finalMessage as any), ...newMessages],
          temperature: 0.5,
          model,
          stream: true,
          functions: functions,
          function_call: "auto"
        })
      },
      async onStart() {
        if (dataRequest.isNewMessage) {
          const library = await getLibraryByFileIdAdmin(dataRequest.fileId)
          const title = createSafeTitle(library?.name || "Untitled")
          await insertChatAdmin(
            chatId,
            userId,
            title || "Untitled",
            options,
            "document",
            dataRequest.fileId
          )
        }
      },
      onCompletion(completion) {
        // no need await, because it is not blocking
        updateUserUsageAdmin(userId, 1) // add usage by 1
      },
      onFinal(completion) {
        // IMPORTANT! you must close StreamData manually or the response will never finish.
        data.close()
      },
      // IMPORTANT! until this is stable, you must explicitly opt in to supporting streamData.
      experimental_streamData: true
    })

    return new StreamingTextResponse(stream, {}, data)
  } catch (error: any) {
    console.error(`Error - Internal Server Error: ${error}`)
    await track("Error - AI Chat Document", {
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
