"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

import { SidebarProvider } from "@/lib/hooks/use-sidebar"
import { I18nProviderClient } from "@/locales/client"

import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({
  children,
  ...props
}: ThemeProviderProps & { locale: string }) {
  return (
    <NextThemesProvider {...props}>
      <I18nProviderClient locale={props.locale}>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </I18nProviderClient>
    </NextThemesProvider>
  )
}
