import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
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

export default function BookSearchPage({ searchParams }: Props) {
  const q = searchParams.q;

  if (!q) redirect("/book");

  const query = String(q);

  return <main></main>;
}
