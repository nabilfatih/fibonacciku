"use client";

import { cn } from "@/lib/utils";
import type { Libraries } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

const LibraryList = dynamic(() => import("@/components/library/list"));
const LibraryPanel = dynamic(() => import("@/components/library/panel"));

export interface LibraryProps extends React.ComponentProps<"div"> {
  libraries: Libraries[];
}

export default function LibraryDocument({
  className,
  libraries,
}: LibraryProps) {
  const refSearch = useRef<HTMLInputElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key combination is either alt + K (for windows) or Command + K (for mac)
      if (
        (navigator.userAgent.includes("Mac") && e.metaKey && e.key === "j") ||
        (!navigator.userAgent.includes("Mac") &&
          e.altKey &&
          e.key.toLocaleLowerCase() === "j")
      ) {
        e.preventDefault();
        refSearch.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredLibraries = useMemo(() => {
    return libraries.filter(library => {
      return library.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [libraries, search]);

  return (
    <>
      <div className="border-b py-4">
        <form className="relative mx-auto max-w-2xl px-4 sm:px-5">
          <IconSearch className="absolute left-7 top-2.5 h-5 w-5 text-muted-foreground sm:left-8" />
          <Input
            tabIndex={-1} // Prevents the input from being focused when the user presses tab
            ref={refSearch}
            type="text"
            placeholder={
              navigator.userAgent.includes("Mac") ? "⌘ + J" : "Alt + J"
            }
            className="h-10 pl-10"
            value={search}
            autoFocus={false}
            autoComplete="off"
            autoCorrect="off"
            onChange={e => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-52 pt-4 sm:pb-60",
          className
        )}
        ref={parentRef}
      >
        <LibraryList parentRef={parentRef} libraries={filteredLibraries} />
      </div>

      <LibraryPanel />
    </>
  );
}
