"use client";

import { cn } from "@/lib/utils";
import type { Libraries } from "@/types/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import supabaseClient from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/context/use-current-user";

const LibraryList = dynamic(() => import("@/components/library/list"));
const LibraryPanel = dynamic(() => import("@/components/library/panel"));

export interface LibraryProps extends React.ComponentProps<"div"> {
  libraries: Libraries[];
}

export default function LibraryDocument({
  className,
  libraries,
}: LibraryProps) {
  const { userDetails } = useCurrentUser();

  const refSearch = useRef<HTMLInputElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState<string>("");
  const [stateLibraries, setStateLibraries] = useState<Libraries[]>([]);

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

  const handleChanges = useCallback(
    async (payload: any) => {
      // use the dispatch from useReducer to handle state changes
      switch (payload.eventType) {
        case "DELETE":
          // If eventType is delete, dispatch an action to filter out the deleted library
          setStateLibraries(
            stateLibraries.filter(library => library.id !== payload.old.id)
          );
          break;
        case "INSERT":
          setStateLibraries([payload.new, ...(stateLibraries || [])]);
          break;
        case "UPDATE":
          // If eventType is update, dispatch an action to update the library in the list
          setStateLibraries(
            stateLibraries.map(library =>
              library.id === payload.new.id ? payload.new : library
            )
          );
          break;
        default:
          // If we've got an action type that's out of this world, just break
          break;
      }
    },
    [stateLibraries]
  );

  useEffect(() => {
    if (!userDetails) return;

    const events = ["INSERT", "UPDATE", "DELETE"];
    const tables = ["libraries"];

    const channel = supabaseClient.channel("user-libraries");

    events.forEach(event => {
      tables.forEach(table => {
        const filter = `user_id=eq.${userDetails.id}`;
        channel.on(
          //@ts-ignore
          "postgres_changes",
          { event, schema: "public", table, filter },
          handleChanges
        );
      });
    });

    channel.subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [handleChanges, userDetails]);

  useEffect(() => {
    setStateLibraries(libraries);
  }, [libraries]);

  const filteredLibraries = useMemo(() => {
    return stateLibraries.filter(library => {
      return library.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, stateLibraries]);

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
          "h-full overflow-y-auto overflow-x-hidden pb-56 pt-4 sm:pb-64",
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
