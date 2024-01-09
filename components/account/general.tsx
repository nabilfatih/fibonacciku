import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  userId: string;
};

export default async function AccountGeneral({ userId }: Props) {
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

  return <section className="mx-auto max-w-2xl px-4"></section>;
}
