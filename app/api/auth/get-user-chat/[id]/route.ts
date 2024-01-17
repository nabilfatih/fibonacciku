import { getUserChatHistoryAdmin } from "@/lib/supabase/admin/users"
import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const chatHistory = await getUserChatHistoryAdmin(id)

    return NextResponse.json(
      {
        userChatHistory: chatHistory
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }
}
