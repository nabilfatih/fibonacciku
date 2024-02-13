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

  // Split the text into individual characters
  const textArray = `${t("hi")} ${userDetails.full_name} 👋`.split("")

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
              staggerChildren: 0.05 // The delay between each letter
            }
          }
        }} // Apply the animation settings
        initial="hidden" // Start with the text hidden
        animate="visible" // Animate to visible
        className="mb-2 text-xl font-semibold sm:text-3xl"
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
