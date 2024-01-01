"use client";

import { cn } from "@/lib/utils";
import type { Libraries } from "@/types/types";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { ViewportList } from "react-viewport-list";
import LibraryCard from "@/components/library/card";

export interface LibraryProps extends React.ComponentProps<"div"> {
  libraries: Libraries[];
}

export default function LibraryDocument({
  className,
  libraries,
}: LibraryProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<any>({});

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
        <LayoutGroup>
          <AnimatePresence initial={false}>
            {filteredLibraries.length > 0 ? (
              <div className="relative mx-auto max-w-2xl px-4">
                <ViewportList
                  ref={listRef}
                  viewportRef={parentRef}
                  items={filteredLibraries}
                >
                  {item => {
                    return <LibraryCard key={item.id} library={item} />;
                  }}
                </ViewportList>
              </div>
            ) : null}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {
        // TODO: Panel
      }
    </>
  );
}
