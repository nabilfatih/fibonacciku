import { cookies } from "next/headers"
import { stripe } from "@/lib/stripe/admin"
import { createOrRetrieveCustomerAdmin } from "@/lib/supabase/admin/users"
import { getURL } from "@/lib/utils"
import { NextResponse } from "next/server"
import { createClientServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const cookieStore = cookies()
      const supabase = createClientServer(cookieStore)
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) throw Error("Could not get user")
      const customer = await createOrRetrieveCustomerAdmin({
        uuid: user.id || "",
        email: user.email || "",
        provider: "stripe"
      })

      if (!customer) throw Error("Could not get customer")
      const { url } = await stripe.billingPortal.sessions.create({
        customer: customer.customer_id,
        return_url: `${getURL()}/chat/assistant`
      })
      return NextResponse.json(
        {
          url
        },
        { status: 200 }
      )
    } catch (error: any) {
      console.error(error)
      return NextResponse.json(
        { error: { statusCode: 500, message: error.message } },
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
