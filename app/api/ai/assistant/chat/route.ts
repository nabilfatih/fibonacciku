import { openai } from "@/lib/openai";
import { defaultToolsChat } from "@/lib/openai/tools";
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from "ai";
import type { ChatCompletionCreateParams } from "openai/resources/chat/index.mjs";
import { callFunction, createTitle } from "./helper";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { cookies } from "next/headers";
import { createClientServer } from "@/lib/supabase/server";
import type { DataMessage } from "@/types/types";
import { determineModelBasedOnSubscription } from "@/lib/openai/helper";
import { updateUserUsageAdmin } from "@/lib/supabase/admin/users";
import { track } from "@vercel/analytics/server";
import { getChatAttachmentSignedUrlAdmin } from "@/lib/supabase/admin/chat";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "edge";

export async function POST(req: Request) {
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
    await track("Error - AI Chat Assistant", {
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

  const { messages, chatId, prompt, optionsData, isNewMessage } =
    await req.json();

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

  const userId = user.id;
  const { model, additionalTools } =
    await determineModelBasedOnSubscription(userId);

  // default function call
  let functionName: any = "auto"; // "auto" | "none" | ChatCompletionCreateParams.FunctionCallOption | undefined
  let functionCall: ChatCompletionCreateParams.Function[] = [
    ...defaultToolsChat,
    ...additionalTools,
  ];
  // get the last message
  const lastMessage = messages[messages.length - 1] as DataMessage;
  if (lastMessage.content.includes("fibo-attachment")) {
    functionName = { name: "image_analysis" };
  }

  // make sure that message length is always max 15, never remove the first index
  // if more than 15, remove from index 1 until the total length is 15
  // This is for make sure there is no spike in cost of openai
  let finalMessage = [...messages];
  if (finalMessage.length > 15) {
    const firstMessage = finalMessage[0];
    finalMessage = [firstMessage, ...finalMessage.slice(-14)];
  }

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: finalMessage,
      temperature: 0.5,
      stream: true,
      functions: functionCall,
      function_call: functionName, // can be auto, none, or the name of the function
      user: userId,
    });

    // Instantiate the StreamData. It works with all API providers.
    const data = new experimental_StreamData();
    const stream = OpenAIStream(response, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages
      ) => {
        // only for image_analysis function
        if (name === "image_analysis") {
          const initialMessages = finalMessage.slice(0, -1);
          const currentMessage = finalMessage[finalMessage.length - 1];
          // remove space in image and split by comma
          const imageIdArray = String(args.image).replace(/\s/g, "").split(",");
          // get image url in parallel
          const imageUrls = await Promise.all(
            imageIdArray.map(imageId =>
              getChatAttachmentSignedUrlAdmin(userId, chatId, imageId)
            )
          ).catch(error => {
            console.error(error);
            return [];
          });
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
                    image_url: imageUrl,
                  })),
                ],
              },
            ],
            user: userId,
          });
        }
        const resultFunction = await callFunction(userId, chatId, name, args);
        data.append(resultFunction);
        const newMessages = createFunctionCallMessages(resultFunction.data);
        return openai.chat.completions.create({
          messages: [...finalMessage, ...newMessages],
          stream: true,
          temperature: 0.5,
          model: model,
          functions: functionCall,
          user: userId,
        });
      },
      async onStart() {
        if (isNewMessage) {
          await createTitle(chatId, userId, prompt, optionsData);
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
    await track("Error - AI Chat Assistant", {
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
