import fs from "fs"
import path from "path"

import ServerReactMarkdown from "@/components/markdown/server"

export default function PrivacyPolicyPage() {
  const privacyPolicyContent = fs.readFileSync(
    path.join(process.cwd(), "content/privacy-policy.mdx"),
    "utf8"
  )

  return (
    <div className="py-10">
      <div className="relative mx-auto max-w-3xl px-4">
        <ServerReactMarkdown content={privacyPolicyContent} />
      </div>
    </div>
  )
}
