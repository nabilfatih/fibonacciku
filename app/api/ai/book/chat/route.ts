import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { track } from "@vercel/analytics/server"
import { kv } from "@vercel/kv"
import {
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse,
  type JSONValue,
  type ToolCallPayload
} from "ai"
import { formatDocumentsAsString } from "langchain/util/document"
import OpenAI from "openai"

import type { DataMessage } from "@/types/types"
import type { ChatRequest } from "@/lib/context/use-message"
import { openai } from "@/lib/openai"
import {
  callTools,
  createSafeTitle,
  determineModelBasedOnSubscription
} from "@/lib/openai/helper"
import { bookRetrieval } from "@/lib/openai/plugin/retrieval"
import { documentRule } from "@/lib/openai/system"
import { defaultToolsChat } from "@/lib/openai/tools"
import { getBooksAdmin } from "@/lib/supabase/admin/book"
import {
  getChatAttachmentSignedUrlAdmin,
  insertChatAdmin
} from "@/lib/supabase/admin/chat"
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
    await track("Error - AI Chat Book", {
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
  const { model, isCostLimit, additionalTools } =
    await determineModelBasedOnSubscription(userId)

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

  // default function call
  let toolChoice: OpenAI.ChatCompletionToolChoiceOption = "auto"
  let tools: OpenAI.ChatCompletionTool[] = [
    ...defaultToolsChat,
    ...additionalTools
  ]

  // get the last message
  const lastMessage = messages[messages.length - 1] as DataMessage

  // make sure that message length is always max 10, never remove the first index
  // if more than 10, remove from index 1 until the total length is 10
  // This is for make sure there is no spike in cost of openai
  let finalMessage = [...messages] as OpenAI.ChatCompletionMessage[]
  if (finalMessage.length > 10) {
    const firstMessage = finalMessage[0]
    finalMessage = [firstMessage, ...finalMessage.slice(-9)]
  }

  // inject system message with additional rules
  finalMessage[0].content += documentRule

  // Retrieve the book
  const query = lastMessage.content
    .split("------------------------------")[0]
    .trim()
  // keyId contain bookId and fileId
  const [bookId, fileId] = dataRequest.fileId.split("--") // this is keyId
  let bookTitle = ""
  // if final message on has 2 message or new message use book title as query
  if (finalMessage.length === 2 || dataRequest.isNewMessage) {
    const book = await getBooksAdmin(bookId)
    // title as query for the first time to get better book content
    if (book) {
      bookTitle = book.title
    }
  }

  // get the book content
  const book = await bookRetrieval(bookId, fileId, bookTitle || query)
  const bookContent = formatDocumentsAsString(book.sources)

  // inject book in the last message with prefix 'book:(newline)', without
  finalMessage[finalMessage.length - 1].content += `\nbook:\n${bookContent}`

  try {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages: finalMessage,
      temperature: 0.5,
      tools,
      tool_choice: toolChoice,
      user: userId
    })

    const data = new experimental_StreamData()
    const stream = OpenAIStream(response, {
      experimental_onToolCall: async (
        call: ToolCallPayload,
        appendToolCallMessage
      ) => {
        if (call.tools[0].func.name === "image_analysis") {
          const initialMessages = finalMessage.slice(0, -1)
          const currentMessage = finalMessage[finalMessage.length - 1]
          const args = JSON.parse(String(call.tools[0].func.arguments))
          // remove space in image and split by comma
          const imageIdArray = String(args.image).replace(/\s/g, "").split(",")
          // get image url in parallel
          const imageUrls = await Promise.all(
            imageIdArray.map(imageId =>
              getChatAttachmentSignedUrlAdmin(userId, chatId, imageId)
            )
          ).catch(error => {
            console.error(error)
            return []
          })
          // the function still not handle the types from ai sdk
          // @ts-ignore
          return openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            stream: true,
            temperature: 0.5,
            max_tokens: 4096, // I don't know why, but in gpt-4-vision-preview, maxTokens must be specified
            messages: [
              ...initialMessages,
              {
                ...currentMessage,
                content: [
                  { type: "text", text: currentMessage.content },
                  ...imageUrls.map(imageUrl => ({
                    type: "image_url",
                    image_url: imageUrl
                  }))
                ]
              }
            ],
            user: userId
          })
        }

        // map over call.tools to get the tool name
        const results = await Promise.all(
          call.tools.map(async tool => {
            return await callTools(
              userId,
              chatId,
              tool.func.name,
              JSON.parse(String(tool.func.arguments))
            ).then(data => {
              return {
                toolId: tool.id,
                toolName: tool.func.name,
                toolResult: data
              }
            })
          })
        ).catch(error => {
          console.error(error)
          throw new Error("Error calling tools")
        })

        // map over results to get the new messages
        const newMessages = results.map(result => {
          return appendToolCallMessage({
            tool_call_id: result.toolId,
            function_name: result.toolName,
            tool_call_result: result.toolResult.result
          })
        })[results.length - 1] // get the last index

        // append data
        for (const message of newMessages) {
          if (message.role === "tool") {
            const value = {
              toolName: message.name,
              data: JSON.parse(String(message.content))
            } as JSONValue
            data.append(value)
          }
        }

        return openai.chat.completions.create({
          messages: [...(finalMessage as any), ...newMessages],
          temperature: 0.5,
          model,
          stream: true,
          tools,
          tool_choice: "auto"
        })
      },
      async onStart() {
        if (dataRequest.isNewMessage) {
          const book = await getBooksAdmin(bookId)
          const title = createSafeTitle(book?.title || "Untitled")
          await insertChatAdmin(
            chatId,
            userId,
            title || "Untitled",
            options,
            "book",
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

    // append the book data
    data.append({
      toolName: "get_document", // same as document tools cause it save the reference in metadata
      data: book
    })

    return new StreamingTextResponse(stream, {}, data)
  } catch (error: any) {
    console.error(`Error - Internal Server Error: ${error}`)
    await track("Error - AI Chat Book", {
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
