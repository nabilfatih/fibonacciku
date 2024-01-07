import * as React from "react";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScopedI18n } from "@/locales/client";
import { IconPhoto, IconSend2, IconSettings } from "@tabler/icons-react";
import ChatSettingsDialog from "@/components/chat/settings-dialog";
import { toast } from "sonner";
import {
  useMessage,
  type MessageContextValue,
} from "@/lib/context/use-message";
import FormAttachment from "@/components/chat/form-attachment";

export type PromptProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: Pick<MessageContextValue, "handleSubmit">["handleSubmit"];
  isLoading: boolean;
  type: string;
  id?: string;
  fileId?: string | null;
};

export default function PromptForm({
  id,
  onSubmit,
  input,
  setInput,
  isLoading,
  type = "document",
  fileId,
}: PromptProps) {
  const t = useScopedI18n("FormChat");

  const { dispatch } = useMessage();

  const { formRef, onKeyDown } = useEnterSubmit();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const isAssistant = React.useMemo(() => type === "assistant", [type]);

  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleUploadChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const { files } = e.target;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file) {
          toast.error(t("no-image-selected"));
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(t("max-file-size-5mb"));
          return;
        }
        dispatch({ type: "SET_ATTACHMENT", payload: file });
      } finally {
        // Clear the input value after each operation
        e.target.value = "";
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        if (type === "document" && !id) {
          toast.error("Choose document first!");
          return;
        }
        setInput("");
        onSubmit(e, false, fileId || ""); // is edit false and give fileId
      }}
      ref={formRef}
    >
      <FormAttachment />
      <div
        className={cn(
          "relative flex max-h-40 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-3xl sm:border sm:px-12",
          !isAssistant && "pl-0 sm:pl-2"
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={e => {
                e.preventDefault();
                setSettingsDialogOpen(true);
              }}
              variant="ghost"
              size="icon"
              className={cn(
                "absolute bottom-[18px] left-0 h-8 w-8 rounded-full bg-background sm:bottom-3.5 sm:left-4"
              )}
            >
              <IconSettings />
              <span className="sr-only">{t("settings")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("settings")}</TooltipContent>
        </Tooltip>

        <ChatSettingsDialog
          open={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
        />

        <input
          ref={fileRef}
          type="file"
          // only accept image files
          accept="image/*"
          className="hidden"
          onChange={handleUploadChange}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={e => {
                e.preventDefault();
                fileRef.current?.click();
              }}
              variant="ghost"
              size="icon"
              className={cn(
                "absolute bottom-[18px] left-9 h-8 w-8 rounded-full bg-background sm:bottom-3.5 sm:left-[3.25rem]",
                !isAssistant && "hidden"
              )}
            >
              <IconPhoto />
              <span className="sr-only">{t("image")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("image")}</TooltipContent>
        </Tooltip>

        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`${t("ask-anything")}...`}
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] pl-12 pr-4 scrollbar-hide focus-within:outline-none sm:text-sm"
          )}
        />
        <div className="absolute bottom-4 right-0 sm:bottom-3 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ""}
              >
                <IconSend2 />
                <span className="sr-only">{t("send")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-muted-background bg-muted-foreground">
              {t("send")}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
