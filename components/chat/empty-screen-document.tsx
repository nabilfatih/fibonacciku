import { useCurrentUser } from "@/lib/context/use-current-user";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { IconFileUpload } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const ChatLibrary = dynamic(() => import("@/components/chat/library"));

export default function EmptyScreenDocument() {
  const t = useScopedI18n("Library");

  const { userDetails } = useCurrentUser();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDragEnter = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
    },
    []
  );

  const handleUploadChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!userDetails) return;

      const { files } = e.target;

      if (!files || files.length === 0) return;

      // only allow one file
      if (files.length > 1) {
        toast.error(t("only-one-document"));
        return;
      }

      const file = files[0];

      if (!file) {
        toast.error(t("no-file-selected"));
        return;
      }

      if (file.type !== "application/pdf") {
        toast.error(t("invalid-document"));
        return;
      }

      if (file.size > 30 * 1024 * 1024) {
        toast.error(t("max-file-size-30mb"));
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userDetails]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);

      const { files } = e.dataTransfer;

      await handleUploadChange({
        target: {
          files,
        },
      } as any);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUploadChange]
  );

  return (
    <div className="mb-2">
      <p className="mb-4 leading-normal text-muted-foreground">
        Upload your document and chat with it.
      </p>

      <form>
        <button
          type="button"
          role="button"
          aria-label={t("drag-drop-document")}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className="relative flex max-h-60 w-full grow cursor-pointer flex-col overflow-hidden rounded-3xl border bg-background px-8 py-4 sm:px-12 sm:py-8"
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            multiple={false}
            onChange={handleUploadChange}
          />

          <div className="pointer-events-none flex w-full flex-col items-center gap-2 text-center transition ease-in-out">
            <div className={cn(isDragging && "animate-bounce")}>
              <IconFileUpload className="h-8 w-8" />
            </div>
            <span>{t("drag-drop-document")}</span>
          </div>
        </button>
      </form>

      {userDetails && <ChatLibrary userId={userDetails.id} />}
    </div>
  );
}
