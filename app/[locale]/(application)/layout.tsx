import { CurrentUserContextProvider } from "@/lib/context/use-current-user";
import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    // <CurrentUserContextProvider session={session}>
    <Suspense>{children}</Suspense>
    // </CurrentUserContextProvider>
  );
}
