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

export type PromptProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  type: string;
};

export default function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  type = "document",
}: PromptProps) {
  const t = useScopedI18n("FormChat");

  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const isAssistant = React.useMemo(() => type === "assistant", [type]);

  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        await onSubmit(e); // is not edit message
      }}
      ref={formRef}
    >
      <div
        className={cn(
          "relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-3xl sm:border sm:px-12",
          !isAssistant && "pl-0 sm:pl-2"
        )}
      >
        <div className={cn(!isAssistant && "hidden")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                  setSettingsDialogOpen(true);
                }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "ghost" }),
                  "absolute bottom-[18px] left-0 h-8 w-8 rounded-full bg-background p-0 sm:bottom-3.5 sm:left-4"
                )}
              >
                <IconSettings />
                <span className="sr-only">{t("settings")}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{t("settings")}</TooltipContent>
          </Tooltip>

          <ChatSettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "ghost" }),
                  "absolute bottom-[18px] left-9 h-8 w-8 rounded-full bg-background p-0 sm:bottom-3.5 sm:left-[3.25rem]"
                )}
              >
                <IconPhoto />
                <span className="sr-only">{t("image")}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{t("image")}</TooltipContent>
          </Tooltip>
        </div>

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
            "min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] pl-12 pr-4 scrollbar-hide focus-within:outline-none sm:text-sm",
            !isAssistant && "pl-2 sm:pl-4"
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
