"use client"

import * as React from "react"
import { createContext, useContextSelector } from "use-context-selector"

const LOCAL_STORAGE_KEY = "sidebar"

type SidebarContext = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isLoading: boolean
}

const SidebarContext = createContext<SidebarContext | undefined>(undefined)

export function useSidebar() {
  const context = useContextSelector(SidebarContext, value => value)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

type SidebarProviderProps = {
  children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true)
  const [isLoading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (value) {
      setSidebarOpen(JSON.parse(value))
    }
    setLoading(false)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen(value => {
      const newState = !value
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, isLoading }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
