"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";

import { useAtBottom } from "@/lib/hooks/use-at-bottom";

type ChatScrollAnchorProps = {
  trackVisibility?: boolean;
};

export default function ChatScrollAnchor({
  trackVisibility,
}: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: "0px 0px -208px 0px",
  });

  React.useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}
