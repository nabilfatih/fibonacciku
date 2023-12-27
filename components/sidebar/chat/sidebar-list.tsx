"use client";

import { ThemeToggle } from "@/components/theme/toggle";
import useChatHistory from "@/lib/swr/use-chat-history";
import LoadingChatHistory from "./loading-chat-history";
import { useScopedI18n } from "@/locales/client";
import { SidebarItems } from "@/components/sidebar/chat/sidebar-items";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentUser } from "@/lib/context/use-current-user";
import type { Chat } from "@/types/types";
import supabaseClient from "@/lib/supabase/client";
import { ClearHistory } from "@/components/sidebar/chat/clear-history";

type Props = {
  userId: string;
};

export default function SidebarList({ userId }: Props) {
  const { userChatHistory, isLoading } = useChatHistory(userId);
  const { userDetails } = useCurrentUser();

  const t = useScopedI18n("Chat");

  const ref = useRef<HTMLDivElement | null>(null);

  const refSearch = useRef<HTMLInputElement | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userChatData, setUserChatData] = useState<Chat[]>([]);

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
    if (!userChatHistory) return;
    setUserChatData(userChatHistory);

    return () => {
      setUserChatData([]);
    };
  }, [userChatHistory]);

  const filteredChats = useMemo(
    () =>
      userChatData.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [userChatData, searchTerm]
  );

  if (isLoading) return <LoadingChatHistory />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="my-2 px-2">
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
      </div>

      <div ref={ref} className="mb-1 flex-1 overflow-y-auto overflow-x-hidden">
        {filteredChats.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={filteredChats} ref={ref} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("chat-not-found")}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t p-2">
        <ThemeToggle />
        <ClearHistory isEnabled={!!userChatData.length} />
      </div>
    </div>
  );
}
