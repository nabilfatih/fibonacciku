"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { IconArrowNarrowDown } from "@tabler/icons-react";
import { useMessage } from "@/lib/context/use-message";
import { useMemo } from "react";

export default function ButtonScrollToBottom({
  className,
  ...props
}: ButtonProps) {
  const { state, showMessage, handleScrollToBottom } = useMessage();

  const isAtBottom = useMemo(() => {
    if (state.scrollPosition === -1) return true;
    if (showMessage.length === 0) return true;
    if (state.scrollPosition - showMessage.length > -5) return true;
  }, [showMessage.length, state.scrollPosition]);

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
