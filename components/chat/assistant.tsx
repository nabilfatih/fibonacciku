import "katex/dist/katex.min.css"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Element } from "hast"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import remarkBreaks from "remark-breaks"
import emoji from "remark-emoji"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"

import type { IndexMessage } from "@/types/types"
import { useMessage } from "@/lib/context/use-message"
import { cn, replaceDelimiters } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import CodeBlock from "@/components/ui/codeblock"
import { IconSpinner } from "@/components/ui/icons"
import ImageMarkdown from "@/components/chat/image"
import MemoizedReactMarkdown from "@/components/markdown"

type Props = {
  index: number
  content: string[]
  currentIndex: IndexMessage
}

export default function ChatAssistant({ index, content, currentIndex }: Props) {
  const t = useScopedI18n("Chat")
  const { state, indexMessage } = useMessage()
  const contentIndex = currentIndex.currentMessage - 1

  const checkIndex = index === indexMessage.length - 1

  const isCursorDisplayed =
    state.isGenerating &&
    checkIndex &&
    currentIndex.currentMessage === content.length

  const [loading, setLoading] = React.useState(false)

  // replace delimiters if latex not use dollar sign delimiter
  const message = `${replaceDelimiters(content[contentIndex] || "")}${
    isCursorDisplayed ? ". . . ▌" : ""
  }`

  React.useEffect(() => {
    // if the message still empty, after 5 seconds, set the loading state to true
    // But if message is not empty, reset the loading state
    if (message === "" || message === "undefined" || message === "null") {
      const timer = setTimeout(() => {
        setLoading(true)
      }, 3000)
      return () => {
        clearTimeout(timer)
      }
    } else {
      setLoading(false)
    }
  }, [message])

  if (message === "" || message === "undefined" || message === "null") {
    return (
      <div className="flex flex-col gap-2">
        <div className="animate-pulse pb-0.5">▌</div>
        {loading && (
          <motion.div
            // animate from up to down, with opacity 0 to 1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 1, y: 10 }}
            className={cn(
              "flex items-center border px-3 py-2 rounded-lg shadow w-fit text-sm"
            )}
          >
            {t("thinking")}
            <IconSpinner className="animate-spin ml-1" />
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <MemoizedReactMarkdown
      className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkBreaks, remarkMath, remarkGfm, emoji, remarkParse]}
      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeStringify]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        hr() {
          return <hr className="my-6 border-foreground/30" />
        },
        pre(props) {
          const { children, className, node, ...rest } = props

          const childrenNode = node?.children[0] as Element
          // handle code block without properties (language)
          const noProperties = childrenNode?.properties?.className === undefined

          return noProperties ? (
            <div className={cn("codeblock relative font-sans")}>
              <pre
                className={cn(
                  className,
                  "no-before no-after rounded-xl border bg-muted"
                )}
                {...props}
              >
                <div className="p-4">{children}</div>
              </pre>
            </div>
          ) : (
            <pre
              className={cn(
                className,
                "no-before no-after rounded-xl border bg-muted font-sans"
              )}
              {...props}
            >
              {children}
            </pre>
          )
        },
        code(props) {
          const { children, className, node, ...rest } = props

          const match = /language-(\w+)/.exec(className || "")

          return match ? (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code
              className={cn(
                className,
                "no-before no-after rounded-xl bg-muted px-2 py-0.5 font-mono text-muted-foreground"
              )}
              {...props}
            >
              {children}
            </code>
          )
        },
        table({ children }) {
          return (
            <div className={cn("overflow-x-auto")}>
              <table className="my-0 border-separate border-spacing-0 border-0">
                {children}
              </table>
            </div>
          )
        },
        th({ children }) {
          return (
            <th className="break-words border-b text-foreground">{children}</th>
          )
        },
        td({ children }) {
          return <td className="break-words border-b">{children}</td>
        },
        a({ children, href }) {
          const DynamicTag = href ? Link : "button"
          return (
            <DynamicTag
              name="link"
              href={String(href)}
              target="_blank"
              className="text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/90"
            >
              {children}
            </DynamicTag>
          )
        },
        img({ src, alt }) {
          return <ImageMarkdown src={src} alt={alt} />
        }
      }}
    >
      {message}
    </MemoizedReactMarkdown>
  )
}
