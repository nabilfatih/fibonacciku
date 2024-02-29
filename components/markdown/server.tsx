import "katex/dist/katex.min.css"

import React from "react"
import Link from "next/link"
import type { Element } from "hast"
import ReactMarkdown from "react-markdown"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import remarkBreaks from "remark-breaks"
import emoji from "remark-emoji"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"

import { cn, replaceDelimiters } from "@/lib/utils"

import CodeBlock from "@/components/ui/codeblock"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import ImageMarkdown from "@/components/chat/image"

export type Props = {
  content: string
  className?: string
}

export default function ServerReactMarkdown({ content, className }: Props) {
  return (
    <ReactMarkdown
      className={cn(
        "prose max-w-none break-words prose-p:leading-relaxed prose-pre:p-0",
        className
      )}
      remarkPlugins={[remarkBreaks, remarkMath, remarkGfm, emoji, remarkParse]}
      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeStringify]}
      components={{
        p({ children }) {
          return <p className="mb-2 w-fit last:mb-0">{children}</p>
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
          return <Table>{children}</Table>
        },
        thead({ children }) {
          return <TableHeader>{children}</TableHeader>
        },
        th({ children }) {
          return <TableHead>{children}</TableHead>
        },
        td({ children }) {
          return <TableCell>{children}</TableCell>
        },
        tr({ children }) {
          return <TableRow>{children}</TableRow>
        },
        tbody({ children }) {
          return <TableBody>{children}</TableBody>
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
      {replaceDelimiters(content)}
    </ReactMarkdown>
  )
}
