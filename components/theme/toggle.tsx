"use client"

import * as React from "react"
import { IconBrush } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import { themes } from "@/lib/data/themes"
import { capitalizeFirstLetter } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type Props = {
  side?: "right" | "top" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export function ThemeToggle({ side = "right", align = "end" }: Props) {
  const { setTheme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <IconBrush className="h-5 w-5 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align}>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(theme => (
          <DropdownMenuItem
            key={theme}
            onClick={() => {
              startTransition(() => {
                setTheme(theme)
              })
            }}
          >
            {capitalizeFirstLetter(theme)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
