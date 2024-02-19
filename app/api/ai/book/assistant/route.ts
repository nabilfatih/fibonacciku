import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { track } from "@vercel/analytics/server"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

import { openai } from "@/lib/openai"
import {
  documentRule,
  getLanguage,
  systemPersonality,
  systemRule
} from "@/lib/openai/system"
import { createClientServer } from "@/lib/supabase/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const { query, document } = (await req.json()) as {
    query: string
    document: string
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

  const messages = [
    {
      role: "system",
      content: `${systemPersonality} 

      ${getLanguage("auto detect")} 

      ${systemRule} 
      
      ${documentRule}

      If the question is not related or not available to these context, say (in language that user used):
      "Sorry, I couldn't find any information on that. Please ask in this link: https://fibonacciku.com/chat/assistant"

      Always answer in language that user used. Keep your answer short and simple. Do not create a follow up question.
      
      Context:
      ${document}`
    },
    {
      role: "user",
      content: query
    }
  ] as OpenAI.ChatCompletionMessageParam[]

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      temperature: 0.4,
      messages,
      user: user.id
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)
    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error(`Error - Internal Server Error: ${error}`)
    await track("Error - AI Book Assistant", {
      data: `${error.message || "High Traffic"}`
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
