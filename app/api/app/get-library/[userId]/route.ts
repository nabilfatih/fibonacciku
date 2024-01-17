import { NextResponse } from "next/server"

import { getUserLibraryAdmin } from "@/lib/supabase/admin/library"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const { userId } = params

    const libraries = await getUserLibraryAdmin(userId)

    return NextResponse.json({ libraries }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }
}
