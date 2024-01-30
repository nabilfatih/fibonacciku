// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Markdown/CodeBlock.tsx

"use client"

import { memo, type FC } from "react"
import {
  IconCheck,
  IconCode,
  IconCopy,
  IconDownload
} from "@tabler/icons-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl as highlighterTheme } from "react-syntax-highlighter/dist/cjs/styles/prism"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"

import { Button } from "@/components/ui/button"

interface Props {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
  tsx: ".tsx",
  jsx: ".jsx"
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const downloadAsFile = () => {
    if (typeof window === "undefined") {
      return
    }
    const fileExtension = programmingLanguages[language] || ".file"
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`
    const fileName = window.prompt("Enter file name" || "", suggestedFileName)

    if (!fileName) {
      // User pressed cancel on prompt.
      return
    }

    const blob = new Blob([value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = fileName
    link.href = url
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(value)
  }

  return (
    <div className="codeblock relative w-full bg-[#070e1b] font-sans">
      <div className="flex w-full items-center justify-between overflow-hidden border-b bg-muted px-6 py-1 pr-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <IconCode className="h-5 w-5" />
          <span className="lowercase">{language}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" onClick={downloadAsFile} size="icon">
            <IconDownload className="h-5 w-5" />
            <span className="sr-only">Download</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onCopy}>
            {isCopied ? (
              <IconCheck className="h-5 w-5" />
            ) : (
              <IconCopy className="h-5 w-5" />
            )}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={highlighterTheme}
        PreTag="div"
        customStyle={{
          margin: 0,
          width: "100%",
          background: "transparent",
          padding: "1.5rem 1rem"
        }}
        lineNumberStyle={{
          userSelect: "none"
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-geist-mono)"
          }
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
})
CodeBlock.displayName = "CodeBlock"

export default CodeBlock
