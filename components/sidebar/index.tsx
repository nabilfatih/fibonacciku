"use client"

import * as React from "react"

import { useSidebar } from "@/lib/hooks/use-sidebar"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.ComponentProps<"div"> {}

function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()

  return (
    <div
      data-state={isSidebarOpen && !isLoading ? "open" : "closed"}
      className={cn("h-full flex-col", className)}
    >
      {children}
    </div>
  )
}

export default React.memo(Sidebar)
