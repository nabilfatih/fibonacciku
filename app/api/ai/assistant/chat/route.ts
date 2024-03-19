import { cookies } from "next/headers"
import { NextResponse } from "next/server"
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
import OpenAI from "openai"

import type { DataMessage } from "@/types/types"
import type { ChatRequest } from "@/lib/context/use-message"
import { openai } from "@/lib/openai"
import {
  callTools,
  createSafeTitle,
  determineModelBasedOnSubscription
} from "@/lib/openai/helper"
import { defaultToolsChat } from "@/lib/openai/tools"
import {
  getChatAttachmentSignedUrlAdmin,
  insertChatAdmin
} from "@/lib/supabase/admin/chat"
import { updateUserUsageAdmin } from "@/lib/supabase/admin/users"
import { createClientServer } from "@/lib/supabase/server"

export const runtime = "edge"

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
    await track("Error - AI Chat Assistant", {
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
  const { model, additionalTools, isCostLimit } =
    await determineModelBasedOnSubscription(userId)

  if (isCostLimit) {
    // return that is in limit access, please consider to buy premium
    return NextResponse.json(
      {
        error: {
          statusCode: 402,
          message:
            "Fibo is in high capacity, please consider to buy premium to get unlimited access"
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
  // TODO: AI SDK is getting error if force to use function, wait until the sdk is stable
  // if (lastMessage.content.includes("fibo-attachment")) {
  //   toolChoice = {
  //     type: "function",
  //     function: {
  //       name: "image_analysis",
  //     },
  //   };
  // }

  // make sure that message length is always max 10, never remove the first index
  // if more than 10, remove from index 1 until the total length is 10
  // This is for make sure there is no spike in cost of openai
  let finalMessage = [...messages] as OpenAI.ChatCompletionMessage[]
  if (finalMessage.length > 10) {
    const firstMessage = finalMessage[0] // system message
    finalMessage = [firstMessage, ...finalMessage.slice(-9)]
  }

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
        // search if the tool is image_analysis
        const isImageAnalysis = call.tools.some(
          tool => tool.func.name === "image_analysis"
        )
        if (isImageAnalysis) {
          const initialMessages = finalMessage.slice(0, -1)
          const currentMessage = finalMessage[finalMessage.length - 1]

          const args = call.tools.find(
            tool => tool.func.name === "image_analysis"
          )?.func.arguments as { image: string } | undefined

          if (!args) {
            throw new Error("No arguments found")
          }

          // remove space in image and split by comma
          const imageIdArray = args.image.trim().split(",")

          // get image url in parallel
          const imageUrls = await Promise.all(
            imageIdArray.map(imageId =>
              getChatAttachmentSignedUrlAdmin(userId, chatId, imageId)
            )
          ).catch(error => {
            console.error(error)
            return []
          })

          // cost for image analysis is 10 usages
          if (imageUrls.length > 0) {
            await updateUserUsageAdmin(userId, 10) // add usage by 10
          }

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
              tool.func.arguments
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
          tool_choice: "auto",
          user: userId
        })
      },
      async onFinal(completion) {
        if (dataRequest.isNewMessage) {
          const prompt = lastMessage.content
            .split("------------------------------")[0]
            .trim()
          const title = createSafeTitle(prompt)
          await insertChatAdmin(
            chatId,
            userId,
            title || "Untitled",
            options,
            "assistant"
          )
        }
        // no need await, because it is not blocking
        await updateUserUsageAdmin(userId, 1) // add usage by 1
        // IMPORTANT! you must close StreamData manually or the response will never finish.
        data.close()
      },
      // IMPORTANT! until this is stable, you must explicitly opt in to supporting streamData.
      experimental_streamData: true
    })

    return new StreamingTextResponse(stream, {}, data)
  } catch (error: any) {
    console.error(`Error - Internal Server Error: ${error}`)
    await track("Error - AI Chat Assistant", {
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
