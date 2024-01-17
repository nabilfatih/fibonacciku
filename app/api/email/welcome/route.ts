import WelcomeEmail from "@/components/emails/welcome"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  const { name, role, email } = (await request.json()) as {
    name: string
    role: string
    email: string
  }

  if (!email || !name || !role) {
    return NextResponse.json(
      { error: { statusCode: 400, message: "Missing required fields" } },
      { status: 400 }
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const data = await resend.emails.send({
      from: "FibonacciKu Team <contact@fibonacciku.com>",
      to: [email],
      subject: `💕 Welcome aboard to FibonacciKu, ${name}!`,
      react: WelcomeEmail({ name, role })
    })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
