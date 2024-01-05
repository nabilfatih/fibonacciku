import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { cookies } from "next/headers";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { PromptTemplate } from "langchain/prompts";
import { getLanguage, systemPersonality } from "@/lib/openai/system";
import { RunnableSequence } from "langchain/schema/runnable";
import {
  BytesOutputParser,
  StringOutputParser,
} from "langchain/schema/output_parser";
import { NextRequest, NextResponse } from "next/server";
import { type Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { createClientServer } from "@/lib/supabase/server";
import OpenAI from "openai";
import { updateUserUsageAdmin } from "@/lib/supabase/admin/users";
import { track } from "@vercel/analytics/server";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { formatDocumentsAsString } from "langchain/util/document";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { determineModelBasedOnSubscription } from "@/lib/openai/helper";
import type { ChatRequest } from "@/lib/context/use-message";

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

  try {
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
