import React from "react";

import { cn } from "@/lib/utils";

export default function FooterText({
  className,
  text,
  ...props
}: React.ComponentProps<"p"> & { text: string }) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className
      )}
      {...props}
    >
      {text}
    </p>
  );
}
