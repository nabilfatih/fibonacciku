import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getScopedI18n("Book");
  
    return {
      title: t("book-collection"),
      alternates: {
        canonical: "/book/collection",
        languages: {
          en: "/en/book/collection",
          id: "/id/book/collection",
          de: "/de/book/collection",
        },
      },
    };
  }

export default function BookCollectionPage() {
    return <main></main>;
}