import { NextResponse } from "next/server"
import { geolocation } from "@vercel/edge"

export const runtime = "edge"

export function GET(request: Request) {
  const location = geolocation(request)
  return NextResponse.json(
    { location },
    {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    }
  )
}
