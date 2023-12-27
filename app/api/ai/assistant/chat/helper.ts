import { insertChatAdmin } from "@/lib/supabase/admin/chat";
import {
  callingGenerateImage,
  callingGoogleYoutubeAcademic,
  callingSolveMathProblem,
  callingWeather,
  callingWebsite,
} from "@/lib/openai/function";

function createSafeTitle(prompt: string) {
  if (prompt.length <= 50) {
    return prompt; // If it's short and sweet, just use it as is.
  }

  // Find the last space before the 50-char limit to avoid word cuts.
  const lastSpaceIndex = prompt.substring(0, 50).lastIndexOf(" ");

  // If there's a space, we cut the prompt there. If not, it's chop-chop at 50 chars!
  return lastSpaceIndex > -1
    ? prompt.substring(0, lastSpaceIndex)
    : prompt.substring(0, 50);
}

export async function createTitle(
  chatId: string,
  userId: string,
  prompt: string,
  optionsData: { language: string; grade: string }
) {
  if (chatId) {
    const title = createSafeTitle(prompt);
    await insertChatAdmin(chatId, userId, title || "Untitled", optionsData);
  }
}

export async function callFunction(
  userId: string,
  chatId: string,
  name: string,
  args: Record<string, unknown>
) {
  let functionResponse = {
    functionName: name,
    data: {},
  };
  if (name === "ask_mathematics_question") {
    functionResponse.data = await callingSolveMathProblem(String(args.query));
  }
  if (name === "get_links_or_videos_or_academic_research") {
    functionResponse.data = await callingGoogleYoutubeAcademic(
      String(args.type),
      String(args.query)
    );
  }
  if (name === "get_website_information") {
    functionResponse.data = await callingWebsite(String(args.url));
  }
  if (name === "get_weather_information") {
    functionResponse.data = await callingWeather(String(args.location));
  }
  if (name === "create_image") {
    functionResponse.data = await callingGenerateImage(
      userId,
      chatId,
      String(args.prompt),
      String(args.size)
    );
  }
  return functionResponse;
}
