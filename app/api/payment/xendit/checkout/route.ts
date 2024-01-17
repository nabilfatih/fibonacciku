import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import moment from "moment"
import type { CreateInvoiceRequest, Invoice } from "xendit-node/invoice/models"

import { priceList } from "@/lib/premium/helpers"
import { createOrRetrieveCustomerAdmin } from "@/lib/supabase/admin/users"
import { createClientServer } from "@/lib/supabase/server"
import { getURL } from "@/lib/utils"
import { xenditClient } from "@/lib/xendit/admin"

const { Invoice: xenditInvoiceClient } = xenditClient

export async function POST(req: Request) {
  if (req.method === "POST") {
    // 1. Destructure the price and quantity from the POST body
    const {
      price,
      currency,
      quantity = 1,
      metadata = {}
    } = (await req.json()) as {
      price: (typeof priceList)[0]
      currency: string
      quantity?: number
      metadata?: any
    }

    try {
      // 2. Get the user from Supabase auth
      const cookieStore = cookies()
      const supabase = createClientServer(cookieStore)
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json(
          { error: { statusCode: 401, message: "Unauthorized" } },
          { status: 401 }
        )
      }

      // 3. Retrieve or create the customer
      const customer = await createOrRetrieveCustomerAdmin({
        uuid: user?.id || "",
        email: user?.email || "",
        provider: "xendit"
      })

      // create how long subscription will be, e.g 1 Nov 2023 - 1 Dec 2023 (for 1 month)
      const startDate = moment().format("DD MMM YYYY") // today
      const endDate =
        price.type === "monthly"
          ? moment().add(1, "months").format("DD MMM YYYY") // 1 month from today
          : moment().add(1, "years").format("DD MMM YYYY") // 1 year from today

      const data: CreateInvoiceRequest = {
        amount:
          price.price.idr * quantity + 0.11 * (price.price.idr * quantity), // 11% VAT
        payerEmail: user.email,
        invoiceDuration: "172800",
        shouldSendEmail: true,
        externalId: `${user.id}-FIBO-${price.priceId}`, // Identifier for the callback
        description: `Fibo ${price.plan} | ${startDate} - ${endDate}`,
        currency: "IDR",
        reminderTime: 1,
        customer: {
          id: customer.id,
          givenNames: customer.users?.full_name,
          email: customer.users?.email,
          customerId: customer.customer_id
        },
        customerNotificationPreference: {
          invoiceCreated: ["email", "whatsapp"],
          invoiceReminder: ["email", "whatsapp"],
          invoicePaid: ["email", "whatsapp"],
          invoiceExpired: ["email", "whatsapp"]
        },
        items: [
          {
            name: `Fibo ${price.plan}`,
            quantity: quantity,
            price: price.price.idr * quantity,
            referenceId: `${user.id}-FIBO-${price.priceId}`,
            category: "Education Artificial Intelligence",
            url: `${getURL()}/pricing`
          }
        ],
        fees: [
          {
            type: "TAX",
            value: 0.11 * (price.price.idr * quantity) // 11% VAT
          }
        ],
        successRedirectUrl: `${getURL()}/chat/assistant?payment=success`,
        failureRedirectUrl: `${getURL()}/pricing`
      }

      const response: Invoice = await xenditInvoiceClient.createInvoice({
        data
      })

      return NextResponse.json({
        provider: "xendit",
        invoiceUrl: response.invoiceUrl
      })
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: { statusCode: 500, message: "Internal Server Error" } },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json(
      { error: { statusCode: 405, message: "Method Not Allowed" } },
      { status: 405 }
    )
  }
}
