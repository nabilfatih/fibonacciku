import { stripe } from "@/lib/stripe/admin";
import {
  manageSubscriptionStatusChangeAdmin,
  upsertPriceRecordAdmin,
  upsertProductRecordAdmin,
} from "@/lib/supabase/admin/users";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.error(`❌ Error message: ${error.message}`);
    return NextResponse.json(
      {
        error: { statusCode: 400, message: `Webhook Error: ${error.message}` },
      },
      { status: 400 }
    );
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecordAdmin(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecordAdmin(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChangeAdmin(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChangeAdmin(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: {
            statusCode: 400,
            message: "Webhook handler failed. View your NextJS function logs.",
          },
        },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      {
        error: {
          statusCode: 400,
          message: `❌ Webhook Error: Unhandled event type ${event.type}`,
        },
      },
      { status: 400 }
    );
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
