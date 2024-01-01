import { useCurrentUser } from "@/lib/context/use-current-user";
import { useScopedI18n } from "@/locales/client";
import type { Libraries } from "@/types/types";
import { IconDots } from "@tabler/icons-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  library: Libraries;
};

export default function LibraryCardFilename({ library }: Props) {
  const t = useScopedI18n("Library");

  const { userDetails } = useCurrentUser();

  const handleSeeDocument = useCallback(
    async (library: Libraries) => {
      if (!userDetails) return;
    },
    [userDetails]
  );

  return (
    <div className="flex items-start justify-between sm:mr-12">
      <div className="flex w-[15rem] flex-col gap-1">
        <span className="text-xs text-muted-foreground">{t("filename")}</span>
        <p
          title={library.name}
          className="cursor-pointer truncate text-sm hover:underline"
          onClick={() => handleSeeDocument(library)}
        >
          {library.name}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        className="sm:hidden"
      >
        <IconDots className="h-5 w-5" />
        <span className="sr-only">Actions</span>
      </Button>
    </div>
  );
}
