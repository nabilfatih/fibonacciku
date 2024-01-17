import {
  getUserDetailsAdmin,
  getUserSubscriptionAdmin
} from "@/lib/supabase/admin/users"
import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Run both promises in parallel
    const [userDetails, subscription] = await Promise.all([
      getUserDetailsAdmin(id),
      getUserSubscriptionAdmin(id)
    ])

    return NextResponse.json(
      {
        userDetails,
        subscription
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
