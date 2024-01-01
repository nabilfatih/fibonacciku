"use client";

import { cn } from "@/lib/utils";
import type { Libraries } from "@/types/types";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const LibraryList = dynamic(() => import("@/components/library/list"));

export interface LibraryProps extends React.ComponentProps<"div"> {
  libraries: Libraries[];
}

export default function LibraryDocument({
  className,
  libraries,
}: LibraryProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState<string>("");

  const filteredLibraries = useMemo(() => {
    return libraries.filter(library => {
      return library.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [libraries, search]);

  return (
    <>
      <div
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden pb-48 pt-4 sm:pb-52 md:pt-10",
          className
        )}
        ref={parentRef}
      >
        <LibraryList parentRef={parentRef} libraries={filteredLibraries} />
      </div>

      {
        // TODO: Panel
      }
    </>
  );
}
