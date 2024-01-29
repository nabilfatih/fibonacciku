import { getScopedI18n } from "@/locales/server"

import BookForm from "@/components/book/form"
import BookRequest from "@/components/book/request"
import FooterText from "@/components/chat/footer"

export default async function BookPanel() {
  const t = await getScopedI18n("Book")
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-background/80 to-background duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="flex h-12 items-center justify-center">
          <BookRequest />
        </div>
        <div className="space-y-2 border-t bg-background p-2 sm:border-none sm:bg-transparent">
          <BookForm />
          <FooterText className="hidden sm:block" text={t("footer")} />
        </div>
      </div>
    </div>
  )
}
