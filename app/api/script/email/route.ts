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
      const dataMessage = `Hi ${email.full_name || "there"}! 🙋‍♂️
      
Exciting news🎉! Fibonacciku now has a new interface with theme options to match your mood. 

You can change the theme by clicking the brush button at the bottom left or by going to your account in the upper right and selecting "Account" -> "Change Theme Preferences".

Now Fibonacciku is also available in 4 languages: English, Indonesian, German, and Russian. 

To change the language, go to your account in the upper right, click on "Account" -> "Change Languages" and select your preferred language.
      
We hope these updates bring a smile to your face. 😊

Try it now at https://fibonacciku.com !! Fibo loves you! ❤️
      
Warm regards,
Nabil, Founder of FibonacciKu`

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
        console.log(`SUCCESS: Email sent to ${email.email}`)
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
