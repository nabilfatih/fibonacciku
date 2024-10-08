import { memo } from "react"
import { motion } from "framer-motion"

import type { Libraries } from "@/types/types"
import { cn } from "@/lib/utils"

import LibraryCardFilename from "@/components/library/card-filename"
import LibraryCardInfo from "@/components/library/card-info"
import LibraryCardStatus from "@/components/library/card-status"

type Props = {
  library: Libraries
  className?: string
}

function LibraryCard({ library, className }: Props) {
  return (
    <motion.div
      layout // This prop indicates that the component is part of a shared layout animation
      key={library.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.25, ease: "easeInOut" }
      }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
      transition={{
        duration: 0.25,
        ease: "easeInOut"
      }}
      className={cn(
        "rounded-xl border bg-card px-4 py-3 text-card-foreground shadow",
        className
      )}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <LibraryCardFilename library={library} />

        <LibraryCardStatus library={library} />

        <LibraryCardInfo library={library} />
      </div>
    </motion.div>
  )
}

export default memo(LibraryCard)
