"use client";

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import React from "react";
import Textarea from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export interface FormProps extends React.ComponentProps<"div"> {}

export default function BookForm({ className }: FormProps) {
  const t = useScopedI18n("Book");
  const { formRef, onKeyDown } = useEnterSubmit();

  const router = useRouter();

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        // replace all question mark with %3F and space with +
        router.push(
          `/book/search?q=${input.replaceAll(" ", "+").replaceAll("?", "%3F")}`
        );
      }}
      ref={formRef}
    >
      <div
        className={cn(
          "relative flex max-h-40 w-full grow flex-col overflow-hidden bg-background sm:rounded-3xl sm:border",
          className
        )}
      >
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute bottom-[18px] left-0 h-8 w-8 rounded-full bg-background sm:bottom-3.5 sm:left-4"
          )}
        >
          <IconSearch />
          <span className="sr-only">Search book</span>
        </Button>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t("placeholder-search")}
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] pl-10 pr-4 scrollbar-hide focus-within:outline-none sm:pl-14 sm:text-sm"
          )}
        />
      </div>
    </form>
  );
}
