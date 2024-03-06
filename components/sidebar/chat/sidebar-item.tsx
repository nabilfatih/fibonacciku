"use client"

import * as React from "react"
import { memo } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { IconBook2, IconFile, IconMessageCircle2 } from "@tabler/icons-react"
import { motion } from "framer-motion"

import { type Chat } from "@/types/types"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface SidebarItemProps {
  chat: Chat
  children: React.ReactNode
}

function SidebarItem({ chat, children }: SidebarItemProps) {
  const params = useParams()
  const pathname = usePathname()
  // chatId can be get from params.id or pathname (/chat/${feature}/${chatId})
  const chatId = params?.id || pathname.split("/")[3] || null

  const isActive = React.useMemo(() => chatId === chat.id, [chatId, chat.id])

  return (
    <motion.div
      className="relative mb-2"
      layout // This prop indicates that the component is part of a shared layout animation
      key={chat.id}
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
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/chat/${chat.type}/${chat.id}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group w-full pl-10 pr-4 font-normal",
              isActive &&
                "bg-primary pr-12 text-primary-foreground transition-colors hover:bg-primary/90 hover:text-primary-foreground"
            )}
          >
            <div className="absolute left-2.5 top-1.5 flex h-6 w-6 items-center justify-center">
              <ChatIcon type={chat.type} />
            </div>
            <p className="relative max-h-5 w-0 flex-1 select-none truncate break-all">
              {chat.title}
            </p>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{chat.title}</p>
        </TooltipContent>
      </Tooltip>

      {isActive && <div className="absolute right-2 top-1.5">{children}</div>}
    </motion.div>
  )
}

function ChatIcon({ type }: { type: string }) {
  switch (type) {
    case "document":
      return <IconFile className="h-4 w-4" />
    case "book":
      return <IconBook2 className="h-4 w-4" />
    default:
      return <IconMessageCircle2 className="h-4 w-4" />
  }
}

export default memo(SidebarItem)
