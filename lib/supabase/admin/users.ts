import Stripe from "stripe"

import type { InvoiceCallbackPayload, Subscription } from "@/types/types"
import type { Database } from "@/types/types_db"
import { stripe } from "@/lib/stripe/admin"
import { generateNanoID, getCurrentDate, toDateTime } from "@/lib/utils"
import { xenditClient } from "@/lib/xendit/admin"

import supabaseAdmin from "."

type Product = Database["public"]["Tables"]["products"]["Row"]
type Price = Database["public"]["Tables"]["prices"]["Row"]

export const upsertProductRecordAdmin = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  }

  const { error } = await supabaseAdmin.from("products").upsert([productData])
  if (error) throw error
  console.log(`Product inserted/updated: ${product.id}`)
}

export const upsertPriceRecordAdmin = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata
  }

  const { error } = await supabaseAdmin.from("prices").upsert([priceData])
  if (error) throw error
  console.log(`Price inserted/updated: ${price.id}`)
}

export const createOrRetrieveCustomerAdmin = async ({
  email,
  uuid,
  provider
}: {
  email: string
  uuid: string
  provider: "stripe" | "xendit"
}) => {
  // First, try to retrieve an existing customer using the UUID.

  const { data: existingCustomerData, error: retrievalError } =
    await supabaseAdmin
      .from("customers")
      .select("*, users(*)")
      .eq("id", uuid)
      .single()

  // If there's an error or no existing customer, we need to create a new one
  if (retrievalError || !existingCustomerData?.customer_id) {
    if (provider === "xendit") {
      return await createCustomerXendit(uuid)
    } else if (provider === "stripe") {
      return await createCustomerStripe(email, uuid)
    } else {
      throw new Error("Provider not supported")
    }
  }

  // Existing customer found, return the data
  return existingCustomerData
}

export const createCustomerXendit = async (uuid: string) => {
  const { Customer: xenditCustomerClient } = xenditClient
  const userDetails = await getUserDetailsAdmin(uuid)
  const customer = await xenditCustomerClient.createCustomer({
    forUserId: uuid,
    data: {
      referenceId: uuid,
      type: "INDIVIDUAL",
      individualDetail: {
        givenNames: userDetails.full_name || userDetails.email
      },
      email: userDetails.email,
      clientName: userDetails.full_name || userDetails.email,
      metadata: {
        supabaseUUID: uuid
      }
    }
  })
  return await insertCustomerAdmin(uuid, customer.id)
}

export const createCustomerStripe = async (email: string, uuid: string) => {
  const customerData = {
    metadata: { supabaseUUID: uuid },
    ...(email && { email })
  }
  const customer = await stripe.customers.create(customerData)
  return await insertCustomerAdmin(uuid, customer.id)
}

export const insertCustomerAdmin = async (uuid: string, customerId: string) => {
  const { data, error: insertError } = await supabaseAdmin
    .from("customers")
    .insert([{ id: uuid, customer_id: customerId }])
    .select("*, users(*)")
    .single()

  if (insertError) {
    throw insertError
  }

  console.log(`New customer created and inserted for ${uuid}.`)
  return data
}

export const manageSubscriptionXendit = async (
  invoicePayload: InvoiceCallbackPayload
) => {
  // grab userId and price from external_id, split by -FIBO-
  const [userId, priceId] = invoicePayload.external_id.split("-FIBO-")

  const startDate = invoicePayload.updated
  // 1 month later, in iso format
  const endDate = new Date(
    new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)
  ).toISOString()

  const subscriptionId = `sub_${generateNanoID(24)}`

  // Upsert the latest status of the subscription object.
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscriptionId,
      user_id: userId,
      metadata: {},
      status: "one_time",
      price_id: priceId,
      quantity: 1,
      cancel_at_period_end: true,
      cancel_at: endDate,
      canceled_at: endDate,
      current_period_start: startDate,
      current_period_end: endDate,
      created: getCurrentDate(),
      ended_at: endDate,
      trial_start: null,
      trial_end: null,
      provider: "xendit" // This api uses Xendit as the payment provider.
    }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData])
  if (error) throw error
  console.log(
    `Inserted/updated subscription [${subscriptionId}] for user [${userId}]`
  )
}
/**
 * Copies the billing details from the payment method to the customer object.
 */
export const copyBillingDetailsToCustomerAdmin = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string
  const { name, phone, address } = payment_method.billing_details
  if (!name || !phone || !address) return
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address })
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq("id", uuid)
  if (error) throw error
}

export const manageSubscriptionStatusChangeAdmin = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("customer_id", customerId)
    .single()
  if (noCustomerError) throw noCustomerError

  const { id: uuid } = customerData!

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
  // Upsert the latest status of the subscription object.
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
      provider: "stripe" // This api uses Stripe as the payment provider.
    }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData])
  if (error) throw error
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  )

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    await copyBillingDetailsToCustomerAdmin(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    )
}

export const getUserDetailsAdmin = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select()
    .eq("id", userId)
  if (error) {
    throw error
  }
  return data[0] || null
}

export const getUserSubscriptionAdmin = async (
  userId: string
): Promise<Subscription | null> => {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .gt("current_period_end", new Date().toISOString())
    .eq("user_id", userId)
    .order("created_at", { ascending: false }) // get the latest subscription
    .limit(1) // only get the latest subscription
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  // check with plan that user use, just the sake of simplicity in the frontend
  const plan = data.prices?.products?.name

  const today = new Date()
  const currentPeriodStart = new Date(data.current_period_start)
  const currentPeriodEnd = new Date(data.current_period_end)

  // Assuming the dates are in UTC, adjust them to the local timezone
  currentPeriodStart.setMinutes(
    currentPeriodStart.getMinutes() + currentPeriodStart.getTimezoneOffset()
  )
  currentPeriodEnd.setMinutes(
    currentPeriodEnd.getMinutes() + currentPeriodEnd.getTimezoneOffset()
  )

  const isActive = today <= currentPeriodEnd && today >= currentPeriodStart

  return {
    ...data,
    isActive,
    planName: plan?.toLocaleLowerCase() || "free"
  }
}

export const getUserChatHistoryAdmin = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("chat")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    throw error
  }

  return data || null
}

export const getUserUsageAdmin = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("usage")
    .eq("id", userId)
    .single()

  if (error) {
    throw error
  }

  return data?.usage || 0 // default usage is 0
}

export const updateUserNameAdmin = async (userId: string, name: string) => {
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      full_name: name
    })
    .eq("id", userId)

  if (error) {
    throw error
  }
}

export const updateUserAvatarAdmin = async (userId: string, avatar: string) => {
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      avatar_url: avatar
    })
    .eq("id", userId)

  if (error) {
    throw error
  }
}

export const updateUserUsageAdmin = async (userId: string, usage: number) => {
  // add current usage with new usage
  const currentUsage = await getUserUsageAdmin(userId)

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      usage: currentUsage + usage
    })
    .eq("id", userId)

  if (error) {
    throw error
  }
}
