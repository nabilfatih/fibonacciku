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
  // const { data, error } = await supabaseAdmin
  //   .from("users")
  //   .select("full_name, email")
  //   // .gt("usage", 0)
  //   .order("usage", { ascending: false })

  // get customers that do not have subscription, join with users table
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*, users(full_name, email)")
    .order("created_at", { ascending: false })

  const { data: subscriptions, error: subscriptionError } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .in("status", ["trialing", "active"])

  if (error || !data || subscriptionError || !subscriptions) {
    console.error(error)
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }

  if (error || !data) {
    console.error(error)
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }

  // only get customers that do not have subscription
  const customers = data.filter(
    customer => !subscriptions.some(sub => sub.user_id === customer.id)
  )

  const emails = customers.map(customer => {
    return {
      full_name: customer.users?.full_name,
      email: customer.users?.email
    }
  })

  console.log("Emails", emails)

  // const emails = data as { full_name: string; email: string }[]

  console.log("Total emails: ", emails.length)

  try {
    for (const email of emails) {
      if (!email.email) continue

      const name = email.full_name || "there"

      const dataMessage = `Hi ${name}! 👋

We noticed you were super close to enjoying our products but didn’t complete your purchase. 🛒

Is there something that held you back? We're here to help with any questions or concerns you might have. 🤔

Your feedback is invaluable to us, and we're keen to understand how we can make your experience better. 

Don't hesitate to reach out. We're all ears! 📞
You can just reply to this email.

Thank you for considering FibonacciKu. We hope to hear from you soon! 🌟

www.fibonacciku.com

Cheers,
Nabil Akbarazzima Fatih
Founder of FibonacciKu`

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "Nabil Fatih <nabilfatih@fibonacciku.com>",
          to: [email.email],
          subject: "Fibo missed you! 😢",
          text: dataMessage
        })
      })

      if (res.ok) {
        console.log(
          `SUCCESS: Email sent to ${email.email} - ${email.full_name}`
        )
      } else {
        console.error(`ERROR: Email not sent to ${email.email}`)
      }
    }

    return NextResponse.json({ message: "Email sent" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }
}
