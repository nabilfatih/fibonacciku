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
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("full_name, email")
    // .gt("usage", 0)
    .order("usage", { ascending: false })

  if (error || !data) {
    console.error(error)
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    )
  }

  const emails = data as { full_name: string; email: string }[]

  console.log("Total emails: ", emails.length)

  try {
    for (const email of emails) {
      const name = email.full_name || "there"

      const dataMessage = `Hi ${name}! 🌟

Big news! FibonacciKu is now live on Product Hunt! 🎉

We're super excited and we need your help. Could you take a moment to support us with an upvote? Every vote brings us closer to helping more people enjoy learning with FibonacciKu. 🙏

Just click here to vote: https://www.producthunt.com/posts/genius-study-buddy-by-fibonacciku

Thank you for being awesome and helping us grow. Your support means the world to us! 🌍

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
          subject: "Fibo needs your Support!🎉",
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
