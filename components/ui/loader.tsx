"use client"

import { memo, useMemo } from "react"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { useTheme } from "next-themes"

import { darkThemes } from "@/lib/data/themes"

type Props = {
  children: React.ReactNode
}

function Loader({ children }: Props) {
  const { resolvedTheme } = useTheme()

  const color = useMemo(() => {
    if (!resolvedTheme) return "#18181b"
    return darkThemes.includes(resolvedTheme) ? "#f4f4f5" : "#18181b"
  }, [resolvedTheme])

  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color={color}
        options={{ showSpinner: false }}
      />
    </>
  )
}

export default memo(Loader)
