import { geolocation } from "@vercel/edge"
import { NextResponse } from "next/server"

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
