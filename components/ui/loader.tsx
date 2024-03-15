"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

type Props = {
  children: React.ReactNode
}

export default function Loader({ children }: Props) {
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
