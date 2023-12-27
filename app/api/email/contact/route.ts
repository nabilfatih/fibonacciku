import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const { subject, email, message } = (await request.json()) as {
    subject: string;
    email: string;
    message: string;
  };

  if (!email || !subject || !message) {
    return NextResponse.json(
      { error: { statusCode: 400, message: "Missing required fields" } },
      { status: 400 }
    );
  }

  try {
    const dataMessage = `
    Email: ${email}\r\n
    Subject: ${subject}\r\n
    Message: ${message}
  `;

    const data = {
      to: "support@fibonacciku.com",
      from: `${email.split("@")[0]} <support-noreply@fibonacciku.com>`,
      subject: `${subject}`,
      text: dataMessage,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: data.from,
        to: [data.to],
        subject: data.subject,
        text: data.text,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: { statusCode: 500, message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
