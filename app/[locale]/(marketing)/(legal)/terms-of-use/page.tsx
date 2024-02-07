import fs from "fs"
import path from "path"

import ServerReactMarkdown from "@/components/markdown/server"

export default function TermsOfUsePage() {
  const termsOfUseContent = fs.readFileSync(
    path.join(process.cwd(), "content/terms-of-use.mdx"),
    "utf8"
  )
  return (
    <div className="py-10">
      <div className="relative mx-auto max-w-3xl px-4">
        <ServerReactMarkdown content={termsOfUseContent} />
      </div>
    </div>
  )
}
