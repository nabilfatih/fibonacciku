import { NextResponse } from "next/server"

import supabaseAdmin from "@/lib/supabase/admin"

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }

  // get users that their usage is more than 0
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("full_name, email")
    // .gt("usage", 0)
    // .order("usage", { ascending: false })
    .eq("referral", "fibo-adit")
    .order("created_at", { ascending: false })

  if (error || !data) {
    console.error(error)
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}
