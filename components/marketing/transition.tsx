"use client"

import { motion } from "framer-motion"

type Props = {
  children: React.ReactNode
  className?: string
}

export default function MarketingTransition({ children, className }: Props) {
  return (
    <motion.main
      // transition effect for page transitions
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.main>
  )
}
