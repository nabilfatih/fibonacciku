"use client"

import React from "react"
import { useTheme } from "next-themes"

import { capitalizeFirstLetter } from "@/lib/utils"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function AccountTheme() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  if (!theme) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <Label className="text-sm text-muted-foreground">Theme preference</Label>
      <Select
        value={capitalizeFirstLetter(theme)}
        onValueChange={value => {
          startTransition(() => {
            setTheme(value.toLowerCase())
          })
        }}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Theme</SelectLabel>
            <SelectItem value="System">System</SelectItem>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
