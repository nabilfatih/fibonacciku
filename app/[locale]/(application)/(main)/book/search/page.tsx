import { createClientServer } from "@/lib/supabase/server";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getScopedI18n("Book");
  const query = String(searchParams.q).split("-").join(" ");

  return {
    title: query !== "undefined" ? `${query}` : t("fibo-book"),
    alternates: {
      canonical: "/book/search",
      languages: {
        en: "/en/book/search",
        id: "/id/book/search",
        de: "/de/book/search",
      },
    },
  };
}

export default async function BookSearchPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/auth/login?next=/book");
  }

  const q = searchParams.q;

  if (!q) redirect("/book");

  const query = String(q);

  return <main></main>;
}
