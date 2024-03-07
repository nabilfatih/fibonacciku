"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

import { darkThemes } from "@/lib/data/themes"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  const theme = useMemo(() => {
    if (!resolvedTheme) return "system"
    return darkThemes.includes(resolvedTheme) ? "dark" : "light"
  }, [resolvedTheme])

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          borderRadius: "1rem"
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
