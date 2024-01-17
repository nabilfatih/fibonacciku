import { NextResponse } from "next/server"
import { ipAddress } from "@vercel/edge"

export const runtime = "edge"

export function GET(request: Request) {
  // Get the IP address of the client making the request
  const ip = ipAddress(request) || "unknown"
  // return the IP address in the response as JSON
  return NextResponse.json(
    { ip },
    {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    }
  )
}
