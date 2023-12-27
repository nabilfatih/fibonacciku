"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const chatFeatures = ["assistant", "document"];

export default function NewChat() {
  const t = useScopedI18n("Chat");

  const pathname = usePathname();
  const params = useParams();

  const feature = String(params.feature);
  const isLibrary = pathname.includes("/library");

  return (
    <div className="mt-4 px-2">
      <Link
        href={
          !chatFeatures.includes(feature)
            ? `/chat/${isLibrary ? "document" : "assistant"}`
            : `/chat/${feature}`
        }
        title={t("new-chat")}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-full justify-start px-4 shadow-none transition-colors"
        )}
      >
        <IconPlus className="-translate-x-2" />
        {t("new-chat")}
      </Link>
    </div>
  );
}
