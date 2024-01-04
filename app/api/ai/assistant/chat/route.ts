import { openai } from "@/lib/openai";
import { defaultToolsChat } from "@/lib/openai/tools";
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
  type ToolCallPayload,
  type JSONValue,
} from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { cookies } from "next/headers";
import { createClientServer } from "@/lib/supabase/server";
import type { DataMessage } from "@/types/types";
import {
  determineModelBasedOnSubscription,
  callTools,
  createSafeTitle,
} from "@/lib/openai/helper";
import { updateUserUsageAdmin } from "@/lib/supabase/admin/users";
import { track } from "@vercel/analytics/server";
import {
  getChatAttachmentSignedUrlAdmin,
  insertChatAdmin,
} from "@/lib/supabase/admin/chat";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import type { ChatRequest } from "@/lib/context/use-message";

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
  const { model, additionalTools } =
    await determineModelBasedOnSubscription(userId);

  // default function call
  let toolChoice: OpenAI.ChatCompletionToolChoiceOption = "auto";
  let tools: OpenAI.ChatCompletionTool[] = [
    ...defaultToolsChat,
    ...additionalTools,
  ];

  // get the last message
  const lastMessage = messages[messages.length - 1] as DataMessage;
  if (lastMessage.content.includes("fibo-attachment")) {
    toolChoice = {
      type: "function",
      function: {
        name: "image_analysis",
      },
    };
  }

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
      ) => {
        if (call.tools[0].func.name === "image_analysis") {
          const initialMessages = finalMessage.slice(0, -1);
          const currentMessage = finalMessage[finalMessage.length - 1];
          const args = call.tools[0].func.arguments;
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
                    image_url: imageUrl,
                  })),
                ],
              },
            ],
            user: userId,
          });
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
                toolResult: data,
              };
            });
          })
        ).catch(error => {
          console.error(error);
          throw new Error("Error calling tools");
        });

        // map over results to get the new messages
        const newMessages = results.map(result => {
          return appendToolCallMessage({
            tool_call_id: result.toolId,
            function_name: result.toolName,
            tool_call_result: result.toolResult,
          });
        })[results.length - 1]; // get the last index

        // append data
        for (const message of newMessages) {
          if (message.role === "tool") {
            const value = {
              toolName: message.name,
              data: JSON.parse(String(message.content)),
            } as JSONValue;
            data.append(value);
          }
        }

        return openai.chat.completions.create({
          messages: [...(finalMessage as any), ...newMessages],
          temperature: 0.5,
          model,
          stream: true,
          tools,
          tool_choice: "auto",
        });
      },
      async onStart() {
        if (dataRequest.isNewMessage) {
          const prompt = lastMessage.content.split(
            "------------------------------"
          )[0]; // this is because of injection of prompt
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
