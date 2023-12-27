import { AppId, extractDataFromXML } from "@/utils/openai/plugin/wolframalpha";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = (await req.json()) as { query: string };

  try {
    const response = await fetch(
      `https://api.wolframalpha.com/v2/query?input=${query}&appid=${AppId}&podstate=Result__Step-by-step%20solution&format=plaintext`
    );
    if (!response.ok) {
      throw new Error(`Error searching WolframAlpha: ${response.statusText}`);
    }
    const xml = await response.text();
    const data = extractDataFromXML(xml);
    return NextResponse.json(data);
  } catch (error) {
    console.log("WolframAlpha Error: ", error);
    return NextResponse.json({
      error: {
        statusCode: 429,
        message: "Quota exceeded for searching WolframAlpha",
      },
    });
  }
}
