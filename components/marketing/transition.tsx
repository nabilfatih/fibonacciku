"use client"

import { motion } from "framer-motion"

type Props = {
  children: React.ReactNode
}

export default function MarketingTransition({ children }: Props) {
  return (
    <motion.div
      // transition effect for page transitions
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
