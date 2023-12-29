"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { IconArrowNarrowDown } from "@tabler/icons-react";
import { useMessage } from "@/lib/context/use-message";
import { useMemo } from "react";
import { useParams } from "next/navigation";

export default function ButtonScrollToBottom({
  className,
  ...props
}: ButtonProps) {
  const params = useParams();
  const { state, showMessage, handleScrollToBottom } = useMessage();

  const feature = useMemo(() => {
    return params.feature as "assistant" | "document";
  }, [params.feature]);

  const isAtBottom = useMemo(() => {
    if (state.scrollPosition === -1) return true;
    return (
      state.scrollPosition + 1 ===
      showMessage.length - (feature === "assistant" ? 1 : 0)
    );
  }, [feature, showMessage.length, state.scrollPosition]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-4 top-1.5 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2",
        isAtBottom ? "opacity-0" : "opacity-100",
        className
      )}
      onClick={handleScrollToBottom}
      {...props}
    >
      <IconArrowNarrowDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
