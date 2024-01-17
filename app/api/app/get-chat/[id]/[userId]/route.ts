import { getUserChatAdmin } from "@/lib/supabase/admin/chat"
import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const { id, userId } = params

    const chat = await getUserChatAdmin(id, userId)

    if (!chat) {
      return NextResponse.json(
        { error: { statusCode: 404, message: "Chat not found" } },
        { status: 404 }
      )
    }

    // expires in 12 hours
    await kv.set(chat.id, chat.title, {
      ex: 60 * 60 * 12,
      nx: true
    })

    return NextResponse.json({ chat }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }
}
