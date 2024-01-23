"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconBook2, IconFile, IconMessageCircle2 } from "@tabler/icons-react"
import { motion } from "framer-motion"

import { type Chat } from "@/types/types"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export default function SidebarItem({
  index,
  chat,
  children
}: SidebarItemProps) {
  const params = useParams()
  const chatId = params?.id

  const isActive = React.useMemo(() => chatId === chat.id, [chatId, chat.id])

  const [newChatId, setNewChatId] = useLocalStorage("newChatId", null)
  const shouldAnimate = index === 0 && isActive && newChatId

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
      <Link
        href={`/chat/${chat.type}/${chat.id}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group w-full pl-10 pr-4 font-normal",
          isActive &&
            "bg-primary pr-12 text-primary-foreground transition-colors hover:bg-primary/90 hover:text-primary-foreground"
        )}
      >
        <div
          className={cn(
            "absolute left-2.5 top-1.5 flex h-6 w-6 items-center justify-center",
            isActive && "text-primary-foreground hover:text-primary-foreground"
          )}
        >
          {chat.type === "document" ? (
            <IconFile className="h-4 w-4" />
          ) : chat.type === "book" ? (
            <IconBook2 className="h-4 w-4" />
          ) : (
            <IconMessageCircle2 className="h-4 w-4" />
          )}
        </div>
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split("").map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      setNewChatId(null)
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1.5">{children}</div>}
    </motion.div>
  )
}
