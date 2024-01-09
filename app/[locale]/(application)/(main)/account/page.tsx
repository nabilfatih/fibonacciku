import AccountGeneral from "@/components/account/general";
import AccountHeader from "@/components/account/header";
import AccountSubscription from "@/components/account/subscription";
import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AccountPage() {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/auth/login?next=/account");
  }

  return (
    <>
      <AccountHeader text="account" />

      <main className="h-[calc(100%-81px)] overflow-y-auto overflow-x-hidden pb-4 pt-4">
        <Suspense>
          <AccountGeneral userId={session.user.id} />
        </Suspense>

        <Suspense>
          <AccountSubscription userId={session.user.id} />
        </Suspense>
      </main>
    </>
  );
}
