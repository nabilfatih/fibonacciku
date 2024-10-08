import { motion } from "framer-motion"

import type { Features } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"
import { useScopedI18n } from "@/locales/client"

import EmptyScreenAssistant from "@/components/chat/empty-screen-assistant"
import EmptyScreenBook from "@/components/chat/empty-screen-book"
import EmptyScreenDocument from "@/components/chat/empty-screen-document"

type Props = {
  type: Features
}

function EmptyScreenFeatures({ type }: Props) {
  switch (type) {
    case "assistant":
      return <EmptyScreenAssistant />
    case "document":
      return <EmptyScreenDocument />
    case "book":
      return <EmptyScreenBook />
    default:
      return <EmptyScreenAssistant /> // default to assistant screen if type is not recognized
  }
}

export default function EmptyScreen({ type }: Props) {
  const t = useScopedI18n("EmptyScreen")
  const { userDetails } = useCurrentUser()

  if (!userDetails) return null

  // only get the first name
  const name = userDetails.full_name?.split(" ")[0] || ""

  const greeting = `${t(`good-${defineGreeting()}`)}`

  // Split the text into individual characters
  const textArray = `${greeting} ${name}`.split("").concat(" 👋")

  return (
    <div className="mx-auto max-w-2xl px-4">
      <motion.h1
        key={userDetails.id}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay: 0.1, // Delay before typing starts
              staggerChildren: 0.025 // The delay between each letter
            }
          }
        }} // Apply the animation settings
        initial="hidden" // Start with the text hidden
        animate="visible" // Animate to visible
        className="mb-2 text-xl font-semibold tracking-tighter sm:text-3xl"
      >
        {textArray.map((char, index) => (
          <motion.span
            key={index}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
      <EmptyScreenFeatures type={type} />
    </div>
  )
}

// check the time, for the greeting, (morning, afternoon, evening, night)
function defineGreeting() {
  const time = new Date().getHours()
  if (time < 12) {
    return "morning"
  } else if (time < 18) {
    return "afternoon"
  } else if (time < 22) {
    return "evening"
  } else {
    return "night"
  }
}
