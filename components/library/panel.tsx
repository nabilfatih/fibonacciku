import { useScopedI18n } from "@/locales/client"

import FooterText from "@/components/chat/footer"
import LibraryForm from "@/components/library/form"

export default function LibraryPanel() {
  const t = useScopedI18n("Library")
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-background/50 to-background duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="space-y-2 border-t bg-background sm:border-none sm:bg-transparent sm:p-2">
          <LibraryForm />
          <FooterText className="hidden sm:block" text={t("footer")} />
        </div>
      </div>
    </div>
  )
}
