import supabaseAdmin from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: { statusCode: 401, message: "Unauthorized" } },
      { status: 401 }
    )
  }

  // get users that their usage is 0, and order by most usage
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("full_name, email")
    .eq("usage", 0)
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
      const dataMessage = `Hi ${email.full_name},

I hope this email finds you well. As the founder of FibonacciKu, I want to personally reach out to you and ask: what challenges are you facing while you study? I'm here to listen your problem and solve it.
    
Please feel free to reply to this email with any problems or concerns you may have.
You can answer in English or Bahasa Indonesia.

Looking forward to hearing from you!

www.fibonacciku.com

Best regards,
Nabil Fatih
Founder, FibonacciKu`

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "Nabil Fatih <nabilfatih@fibonacciku.com>",
          to: [email.email],
          subject: "Greetings from Founder of FibonacciKu!",
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
