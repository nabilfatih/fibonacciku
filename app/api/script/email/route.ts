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
      const dataMessage = `Hey ${email.full_name || "there"}! 🎈

Nabil here, from FibonacciKu. I've got some thrilling news that I can't wait to share with you! 🌟

Mark your calendars for 16 February 2024, because that's the day FibonacciKu will officially launch on Product Hunt! 🚀

This is more than just a launch; it's a celebration of what we've built together, and your support means everything to us. By joining us on this special day and voting for FibonacciKu, you help us reach more curious minds and keep our service free and accessible. 🎉

Here's where you can show your support: https://www.producthunt.com/products/genius-study-buddy-by-fibonacciku

Stay tuned for the link to our Product Hunt page, and thank you for being such an integral part of our community. Together, we're making learning fun and accessible for everyone! 📚

Can't wait to celebrate with you,
Nabil Akbarazzima Fatih
Founder of FibonacciKu❤️`

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "Nabil Fatih <nabilfatih@fibonacciku.com>",
          to: [email.email],
          subject: "Exciting news from Fibonacciku🎉",
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
