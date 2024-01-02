import { Button } from "@/components/ui/button";
import { useMessage } from "@/lib/context/use-message";
import { useScopedI18n } from "@/locales/client";
import type { SourceDocument } from "@/types/types";
import { IconFile } from "@tabler/icons-react";

type Props = {
  metadata: SourceDocument[];
};

export default function ChatMetadataReferences({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat");

  const { pageRef } = useMessage();

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconFile className="h-5 w-5" />
        <span className="font-medium">{t("references")}:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{t("page")}</span>
        {metadata.map((item, index) => {
          return (
            <Button
              name="page"
              title={`${t("page")} ${item.page_number}`}
              key={index}
              size="sm"
              onClick={() => {
                const main = pageRef.current;
                if (main && typeof main.scrollToIndex === "function") {
                  main.scrollToIndex({
                    index: item.page_number - 1,
                    alignToTop: true,
                  });
                }
              }}
            >
              {item.page_number}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
