import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClientServer } from "@/lib/supabase/server"
import { getScopedI18n } from "@/locales/server"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import AccountLanguage from "@/components/account/language"
import AccountName from "@/components/account/name"
import AccountResetPassword from "@/components/account/reset-password"
import AccountRole from "@/components/account/role"
import AccountTheme from "@/components/account/theme"

type Props = {
  userId: string
}

export default async function AccountGeneral({ userId }: Props) {
  const t = await getScopedI18n("ModalAccount")
  const cookieStore = cookies()
  const supabase = createClientServer(cookieStore)
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .maybeSingle()

  if (!data) {
    await supabase.auth.signOut()
    redirect("/auth/login?next=/account")
  }

  return (
    <section className="mx-auto max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("hi")} {data.full_name} 👋
          </CardTitle>
          <CardDescription>{t("account-desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
              <Label className="text-sm text-muted-foreground">
                {t("your-email")}
              </Label>
              <p className="text-sm leading-none">{data.email}</p>
            </div>

            <AccountName userId={userId} fullName={data.full_name || ""} />

            <AccountRole userId={userId} role={data.role} />

            <AccountTheme userId={userId} />

            <AccountLanguage userId={userId} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center gap-2">
          <AccountResetPassword email={data.email} />
        </CardFooter>
      </Card>
    </section>
  )
}
