"use client";

import { useCurrentUser } from "@/lib/context/use-current-user";
import { useScopedI18n } from "@/locales/client";

export default function BookEmptyScreen() {
  const t = useScopedI18n("Book");
  const { userDetails } = useCurrentUser();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
        Hi{` ${userDetails?.full_name ?? ""}`} 👋
      </h1>

      <div className="mb-2">
        <p className="mb-2 leading-normal text-muted-foreground">
          {t("desc-search")}
        </p>
      </div>
    </div>
  );
}
