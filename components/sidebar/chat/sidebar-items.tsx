"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";

import type { Chat } from "@/types/types";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import supabaseClient from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/context/use-current-user";
import { ViewportList } from "react-viewport-list";

type SidebarItemsProps = {
  chats: Chat[];
};

export function SidebarItems({ chats }: SidebarItemsProps) {
  const { userDetails } = useCurrentUser();

  const refSearch = useRef<HTMLInputElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const listRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userChatData, setUserChatData] = useState<Chat[]>(chats);

  const handleChanges = useCallback(async (payload: any) => {
    // use switch statement for better readability and efficiency
    switch (payload.eventType) {
      case "DELETE":
        // If eventType is delete, remove the object from userChatData
        setUserChatData((prev) => {
          return prev.filter((chat) => chat.id !== payload.old.id);
        });
        break;
      case "INSERT":
        // If eventType is insert, add the object to userChatData at the top of the list (it's the latest)
        setUserChatData((prev) => {
          return [payload.new, ...prev];
        });
        break;
      case "UPDATE":
        // If eventType is update, update the object in userChatData
        setUserChatData((prev) => {
          return prev.map((chat) => {
            if (chat.id === payload.new.id) {
              return payload.new;
            }
            return chat;
          });
        });
        break;
      default:
        // handle unrecognized eventType
        break;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key combination is either alt + K (for windows) or Command + K (for mac)
      if (
        (navigator.userAgent.includes("Mac") && e.metaKey && e.key === "k") ||
        (!navigator.userAgent.includes("Mac") &&
          e.altKey &&
          e.key.toLocaleLowerCase() === "k")
      ) {
        e.preventDefault();
        refSearch.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!userDetails) return;

    const events = ["INSERT", "UPDATE", "DELETE"];
    const tables = ["chat"];

    const channel = supabaseClient.channel("user-chat");

    events.forEach((event) => {
      tables.forEach((table) => {
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
    setUserChatData(chats);

    return () => {
      setUserChatData([]);
    };
  }, [chats]);

  const filteredChats = useMemo(
    () =>
      userChatData.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [userChatData, searchTerm]
  );

  if (!chats?.length) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <form className="relative">
        <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          ref={refSearch}
          type="text"
          placeholder={
            navigator.userAgent.includes("Mac") ? "⌘ + K" : "Alt + K"
          }
          className="h-10 pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <LayoutGroup>
        <AnimatePresence>
          <ViewportList ref={listRef} viewportRef={ref} items={filteredChats}>
            {(item) => <div key={item.id}></div>}
          </ViewportList>
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
