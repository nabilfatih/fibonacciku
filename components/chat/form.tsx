import * as React from "react";
import Textarea from "react-textarea-autosize";
import { type UseChatHelpers } from "ai/react";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { IconPhoto, IconSend2, IconSettings } from "@tabler/icons-react";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export default function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const t = useScopedI18n("FormChat");

  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        await onSubmit(input);
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-3xl sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.refresh();
                router.push("/");
              }}
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "absolute bottom-4 left-0 h-8 w-8 rounded-full bg-background p-0 sm:bottom-3.5 sm:left-4"
              )}
            >
              <IconSettings />
              <span className="sr-only">{t("settings")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{t("settings")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.refresh();
                router.push("/");
              }}
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "absolute bottom-4 left-9 h-8 w-8 rounded-full bg-background p-0 sm:bottom-3.5 sm:left-[3.25rem]"
              )}
            >
              <IconPhoto />
              <span className="sr-only">{t("image")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{t("image")}</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${t("ask-anything")}...`}
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] pl-12 pr-4 focus-within:outline-none sm:text-sm"
        />
        <div className="absolute bottom-4 right-0 sm:bottom-3.5 sm:right-4">
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
            <TooltipContent>{t("send")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
