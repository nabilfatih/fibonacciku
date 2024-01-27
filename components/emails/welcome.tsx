import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components"

const baseUrl = "https://www.fibonacciku.com"

type WelcomeEmailProps = {
  name?: string
  role?: string
}

export default function WelcomeEmail({
  name = "Nabil",
  role = "student"
}: WelcomeEmailProps) {
  const company = "FibonacciKu"

  const previewText = `We are thrilled to have you here 🚀`

  const textRole = (role: string) => {
    if (role === "student") {
      return "embark on a journey to transform learning experiences through"
    } else if (role === "teacher") {
      return "collaborate on revolutionizing teaching experiences through"
    } else {
      return "embark on a journey to enhance your work through"
    }
  }

  return (
    <Html>
      <Head>
        <title>Welcome to FibonacciKu!</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-zinc-100 mx-auto my-auto font-sans text-zinc-900">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Section className="mt-8">
              <Img
                src={`${baseUrl}/logo.png`}
                width="80"
                height="80"
                alt="FibonacciKu Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Welcome aboard to <strong>{company}</strong>, {name}! 💕
            </Heading>
            <Text className="text-sm">
              We&#39;re thrilled to have you here as we {textRole(role)}{" "}
              FibonacciKu&#39;s intelligent and user-friendly AI-powered
              platform.
            </Text>

            <Text className="text-sm">
              You are now all set to surf our best features for{" "}
              <strong>FREE</strong>! 🎉
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="w-full rounded-xl bg-[#39c7f4] px-4 py-3 text-center text-sm font-semibold text-zinc-900 no-underline"
                href={`${baseUrl}`}
              >
                Get Started
              </Button>
            </Section>

            <Text className="text-sm">
              Take a look at our amazing{" "}
              <Link
                href={`${baseUrl}/premium`}
                className="text-[#ee3554] underline"
              >
                features
              </Link>{" "}
              😍
            </Text>

            <Text className="text-sm">
              Ready to dive into an exciting world of boundless possibilities
              with FibonacciKu? Get set to chat, brainstorm, and collaborate
              like a pro.
            </Text>

            <Text className="text-sm">
              Cheers,
              <br />
              Nabil, Founder of FibonacciKu
            </Text>

            <Hr className="my-4 border-zinc-500" />

            <Text className="text-center text-sm">
              <Link
                href={`${baseUrl}/chat/assistant`}
                className="mr-2 text-zinc-500 underline"
              >
                Product
              </Link>
              <Link
                href={`${baseUrl}/premium`}
                className="mr-2 text-zinc-500 underline"
              >
                Premium
              </Link>
              <Link
                href={`${baseUrl}/chat/assistant`}
                className="mr-2 text-zinc-500 underline"
              >
                About
              </Link>
              <Link
                href={`${baseUrl}/account`}
                className="mr-2 text-zinc-500 underline"
              >
                Contact
              </Link>
            </Text>

            <Text className="text-center text-sm text-zinc-500">
              PT. Nakafa Tekno Kreatif, Taman Sukahati Permai H6, Sukahati,
              Cibinong, Kab. Bogor, Jawa Barat, 16913, Indonesia
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
