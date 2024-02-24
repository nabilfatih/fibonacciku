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

const company = "FibonacciKu"

const previewText = `We are thrilled to have you here 🚀`

const textRole = (role: string) => {
  switch (role) {
    case "student":
      return "embark on a journey to transform learning experiences through"
    case "teacher":
      return "collaborate on revolutionizing teaching experiences through"
    default:
      return "embark on a journey to enhance your work through"
  }
}

type WelcomeEmailProps = {
  name?: string
  role?: string
}

export default function WelcomeEmail({
  name = "Nabil",
  role = "student"
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Welcome to FibonacciKu!</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-zinc-100 font-sans text-zinc-900">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Section className="mt-8">
              <Img
                src={`${baseUrl}/logo.png`}
                width="64"
                height="64"
                alt="FibonacciKu Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal text-zinc-900">
              Welcome aboard to <strong>{company}</strong>, {name}! 💕
            </Heading>
            <Text className="text-sm text-zinc-900">
              We&#39;re thrilled to have you here as we {textRole(role)}{" "}
              FibonacciKu&#39;s intelligent and user-friendly AI Assistant.
            </Text>

            <Text className="text-sm text-zinc-900">
              You are now all set to surf our best features for{" "}
              <strong>FREE</strong>! 🎉
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="w-full rounded-xl bg-[#15294f] px-4 py-3 text-center text-sm font-semibold text-zinc-100 no-underline"
                href={baseUrl}
              >
                Get Started
              </Button>
            </Section>

            <Text className="text-sm text-zinc-900">
              Take a look at our amazing{" "}
              <Link
                href={`${baseUrl}/premium`}
                className="text-[#ee3554] underline underline-offset-4"
              >
                features
              </Link>{" "}
              😍
            </Text>

            <Text className="text-sm text-zinc-900">
              Ready to dive into an exciting world of boundless possibilities
              with FibonacciKu? Get set to chat, brainstorm, and collaborate
              like a pro.
            </Text>

            <Text className="text-sm text-zinc-900">
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
                href={`${baseUrl}/about`}
                className="mr-2 text-zinc-500 underline"
              >
                About
              </Link>
              <Link
                href={`${baseUrl}/contact`}
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
