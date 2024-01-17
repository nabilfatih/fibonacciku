import { manageSubscriptionXendit } from "@/lib/supabase/admin/users"
import type { InvoiceCallbackPayload } from "@/types/types"
import { NextResponse } from "next/server"

const relevantEvents = new Set(["invoices"])

export async function POST(
  req: Request,
  { params }: { params: { event: string } }
) {
  const payload = (await req.json()) as InvoiceCallbackPayload

  const event = params.event
  const sig = req.headers.get("x-callback-token") as string

  if (!sig || sig !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return NextResponse.json(
      {
        error: {
          statusCode: 400,
          message: `❌ Webhook Error: Invalid signature`
        }
      },
      { status: 400 }
    )
  }

  if (relevantEvents.has(event)) {
    try {
      switch (event) {
        case "invoices":
          if (payload.status === "PAID") {
            await manageSubscriptionXendit(payload)
          }
          break
        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error: any) {
      console.error(error)
      return NextResponse.json(
        {
          error: {
            statusCode: 400,
            message: "Webhook handler failed. View your NextJS function logs."
          }
        },
        { status: 400 }
      )
    }
  } else {
    return NextResponse.json(
      {
        error: {
          statusCode: 400,
          message: `❌ Webhook Error: Unhandled event type ${event}`
        }
      },
      { status: 400 }
    )
  }
  return NextResponse.json({ received: true }, { status: 200 })
}
