import { NextResponse, type NextRequest } from "next/server"

import {
  deleteChatAdmin,
  getChatAllWithFileAdmin
} from "@/lib/supabase/admin/chat"
import { getLibraryByFileIdAdmin } from "@/lib/supabase/admin/library"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

// TODO: This script is more cleaning chat, when there is no library, delete chat
// TODO: Migration to library table
// TODO: Only run in your local machine

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }
  const chats = await getChatAllWithFileAdmin()

  // loop over chats
  for (const chat of chats) {
    if (!chat.file_id) {
      continue
    }
    // get library
    const library = await getLibraryByFileIdAdmin(chat.file_id)

    // if there is no library, delete chat
    if (!library) {
      await deleteChatAdmin(chat.id)
    }
  }

  return NextResponse.json({ message: "Success" }, { status: 200 })
}
