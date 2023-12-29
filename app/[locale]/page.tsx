import { ThemeToggle } from "@/components/theme/toggle";
import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/chat/assistant");
  }

  return (
    <main>
      <ThemeToggle />
    </main>
  );
}
