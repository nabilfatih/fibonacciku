import { createClientServer } from "@/lib/supabase/server";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("ProductFiboBook");

  return {
    title: {
      absolute: t("fibo-book"),
    },
    description: `${t("header")}. ${t("fibo-book-description")}`,
    alternates: {
      canonical: "/book",
      languages: {
        en: "/en/book",
        id: "/id/book",
        ms: "/de/book",
      },
    },
  };
}

export default async function BookPage() {
  const t = await getScopedI18n("Book");

  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/auth/login?next=/book");
  }

  return <main></main>;
}
