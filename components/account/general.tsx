import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScopedI18n } from "@/locales/server";
import { Label } from "@/components/ui/label";
import AccountLogout from "@/components/account/logout";
import AccountResetPassword from "@/components/account/reset-password";
import AccountLanguage from "@/components/account/language";
import AccountTheme from "@/components/account/theme";
import AccountRole from "@/components/account/role";

type Props = {
  userId: string;
};

export default async function AccountGeneral({ userId }: Props) {
  const t = await getScopedI18n("ModalAccount");
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .maybeSingle();

  if (!data) {
    await supabase.auth.signOut();
    redirect("/auth/login?next=/account");
  }

  return (
    <section className="mx-auto max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Hi {data.full_name} 👋</CardTitle>
          <CardDescription>
            You can update your account information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
              <Label className="text-sm text-muted-foreground">
                {t("your-email")}
              </Label>
              <p className="text-sm leading-none">{data.email}</p>
            </div>

            <AccountRole userId={userId} role={data.role} />

            <AccountTheme />

            <AccountLanguage userId={userId} />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <AccountResetPassword email={data.email} />
          <AccountLogout />
        </CardFooter>
      </Card>
    </section>
  );
}
