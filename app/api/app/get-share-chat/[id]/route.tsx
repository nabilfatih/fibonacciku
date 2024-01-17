import { NextResponse } from "next/server"

import { getShareChatByChatIdAdmin } from "@/lib/supabase/admin/shareChat"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params // chatId

    const shareChat = await getShareChatByChatIdAdmin(id)

    return NextResponse.json(
      {
        shareChat
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
