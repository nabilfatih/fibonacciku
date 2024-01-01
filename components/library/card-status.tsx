import { useScopedI18n } from "@/locales/client";
import { IconCircleFilled } from "@tabler/icons-react";
import type { Libraries } from "@/types/types";
import { cn } from "@/lib/utils";
import LibraryCardInfo from "@/components/library/card-info";

type Props = {
  library: Libraries;
};

const statusToColor = (status: string) => {
  switch (status) {
    case "processing":
      return "text-warning animate-pulse";
    case "invalid":
      return "text-error";
    case "finished":
      return "text-success";
    default:
      return "";
  }
};

export default function LibraryCardStatus({ library }: Props) {
  const t = useScopedI18n("Library");

  return (
    <div className="border-base-100 flex-1 border-t pt-2 sm:border-0 sm:pt-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("status")}</span>
          <div className="flex items-center">
            <IconCircleFilled
              className={cn("mr-1 h-4 w-4", statusToColor(library.status))}
            />
            <p className="text-sm">{t(library.status as never)}</p>
          </div>
        </div>

        <LibraryCardInfo library={library} className="flex sm:hidden" />
      </div>
    </div>
  );
}
