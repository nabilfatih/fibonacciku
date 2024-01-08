import AccountHeader from "@/components/account/header";
import AccountSubscription from "@/components/account/subscription";
import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function AccountPage() {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/auth/login?next=/account");
  }

  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", session.user.id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <>
      <AccountHeader text="account" />

      <main className="h-full overflow-y-auto overflow-x-hidden py-4">
        <AccountSubscription userId={session.user.id} />
      </main>
    </>
  );
}
