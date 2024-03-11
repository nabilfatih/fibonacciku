"use client"

import { memo } from "react"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

type Props = {
  children: React.ReactNode
}

function Loader({ children }: Props) {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="hsl(var(--primary))"
        options={{ showSpinner: false }}
      />
    </>
  )
}

export default memo(Loader)
