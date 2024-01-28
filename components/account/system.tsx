import { getScopedI18n } from "@/locales/server"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import AccountLogout from "@/components/account/logout"
import Feedback from "@/components/header/feedback"

export default async function AccountSystem() {
  const t = await getScopedI18n("ModalAccount")
  return (
    <section className="mx-auto max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("system")}</CardTitle>
          <CardDescription>{t("system-desc")}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <Feedback variant="default" className="w-auto" />
          <AccountLogout />
        </CardFooter>
      </Card>
    </section>
  )
}
