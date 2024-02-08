import fs from "fs"
import path from "path"

import ServerReactMarkdown from "@/components/markdown/server"

export default function PrivacyPolicyPage() {
  const privacyPolicyContent = fs.readFileSync(
    path.join(process.cwd(), "content/privacy-policy.mdx"),
    "utf8"
  )

  return (
    <main>
      <div className="bg-muted py-16 sm:py-24">
        <h1 className="relative mx-auto w-fit px-4 text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
          Privacy Policy
        </h1>
      </div>
      <div className="py-10">
        <div className="relative mx-auto max-w-3xl px-4">
          <ServerReactMarkdown content={privacyPolicyContent} />
        </div>
      </div>
    </main>
  )
}
