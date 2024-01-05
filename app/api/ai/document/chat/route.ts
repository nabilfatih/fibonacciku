import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  StreamingTextResponse,
  experimental_StreamData,
  OpenAIStream,
  type ToolCallPayload,
} from "ai";
import { createClientServer } from "@/lib/supabase/server";
import OpenAI from "openai";
import { updateUserUsageAdmin } from "@/lib/supabase/admin/users";
import { track } from "@vercel/analytics/server";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import {
  createSafeTitle,
  determineModelBasedOnSubscription,
} from "@/lib/openai/helper";
import type { ChatRequest } from "@/lib/context/use-message";
import { listToolsChat } from "@/lib/openai/tools";
import { openai } from "@/lib/openai";
import { insertChatAdmin } from "@/lib/supabase/admin/chat";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for");
  const ratelimit = new Ratelimit({
    redis: kv,
    // rate limit to 5 requests per 10 seconds
    limiter: Ratelimit.slidingWindow(5, "10s"),
  });

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  );

  if (!success) {
    await track("Error - AI Chat Document", {
      data: `${ip} - Rate Limit Exceeded`,
    });
    return NextResponse.json(
      {
        error: {
          statusCode: 429,
          message: "Too Many Requests",
        },
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  const {
    messages,
    options,
    data: dataRequest,
  } = (await req.json()) as ChatRequest;

  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const chatId = dataRequest.chatId;
  const userId = user.id;
  const { model } = await determineModelBasedOnSubscription(userId);

  // default function call
  let toolChoice: OpenAI.ChatCompletionToolChoiceOption = {
    type: "function",
    function: {
      name: "get_document",
    },
  };

  let tools: OpenAI.ChatCompletionTool[] = listToolsChat.filter(
    tool => tool.function.name === "get_document"
  );

  // make sure that message length is always max 15, never remove the first index
  // if more than 15, remove from index 1 until the total length is 15
  // This is for make sure there is no spike in cost of openai
  let finalMessage = [...messages] as OpenAI.ChatCompletionMessage[];
  if (finalMessage.length > 15) {
    const firstMessage = finalMessage[0];
    finalMessage = [firstMessage, ...finalMessage.slice(-14)];
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages: finalMessage,
      temperature: 0.5,
      tools,
      tool_choice: toolChoice,
      user: userId,
    });

    const data = new experimental_StreamData();
    const stream = OpenAIStream(response, {
      experimental_onToolCall: async (
        call: ToolCallPayload,
        appendToolCallMessage
      ) => {},
      async onStart() {
        if (dataRequest.isNewMessage) {
          const prompt = ""; // TODO: Name of file
          const title = createSafeTitle(prompt);
          await insertChatAdmin(chatId, userId, title || "Untitled", options);
        }
      },
      onCompletion(completion) {
        // no need await, because it is not blocking
        updateUserUsageAdmin(userId, 1); // add usage by 1
      },
      onFinal(completion) {
        // IMPORTANT! you must close StreamData manually or the response will never finish.
        data.close();
      },
      // IMPORTANT! until this is stable, you must explicitly opt in to supporting streamData.
      experimental_streamData: true,
    });

    return new StreamingTextResponse(stream, {}, data);
  } catch (error: any) {
    console.error(`Error - Internal Server Error: ${error}`);
    await track("Error - AI Chat Document", {
      data: `${userId} - ${error.message || "High Traffic"}`,
    });
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          error: {
            name,
            status,
            headers,
            message: "High Traffic",
            text: message,
          },
        },
        { status }
      );
    } else {
      return NextResponse.json(
        {
          error: {
            message: "High Traffic",
          },
        },
        { status: 500 }
      );
    }
  }
}
