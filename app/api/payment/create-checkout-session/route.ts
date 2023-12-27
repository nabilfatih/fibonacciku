import { cookies } from "next/headers";
import type { priceList } from "@/lib/helpers";
import { createOrRetrieveCustomerAdmin } from "@/lib/supabase/admin/users";
import { stripe } from "@/lib/stripe/admin";
import { getURL } from "@/lib/utils";
import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (req.method === "POST") {
    // 1. Destructure the price and quantity from the POST body
    const {
      price,
      currency,
      quantity = 1,
      metadata = {},
    } = (await req.json()) as {
      price: (typeof priceList)[0];
      currency: string;
      quantity?: number;
      metadata?: any;
    };

    try {
      // 2. Get the user from Supabase auth
      const cookieStore = cookies();
      const supabase = createClientServer(cookieStore);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 3. Retrieve or create the customer in Stripe
      const customer = await createOrRetrieveCustomerAdmin({
        uuid: user?.id || "",
        email: user?.email || "",
        provider: "stripe",
      });

      // 4. Create a checkout session in Stripe
      let session;
      session = await stripe.checkout.sessions.create({
        payment_method_collection: "always",
        billing_address_collection: "required",
        customer: customer.customer_id,
        customer_update: {
          shipping: "auto",
          address: "auto",
          name: "auto",
        },
        line_items: [
          {
            price: price.priceId,
            quantity,
          },
        ],
        currency,
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
        mode: "subscription",
        allow_promotion_codes: true,
        subscription_data: {
          trial_period_days: 7,
          metadata,
        },
        success_url: `${getURL()}/chat/assistant?payment=success`,
        cancel_url: `${getURL()}/pricing`,
      });

      if (session) {
        return NextResponse.json(
          {
            provider: "stripe",
            sessionId: session.id,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: { statusCode: 500, message: "Session is not defined" } },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: { statusCode: 500, message: "Internal Server Error" } },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: { statusCode: 405, message: "Method Not Allowed" } },
      { status: 405 }
    );
  }
}
