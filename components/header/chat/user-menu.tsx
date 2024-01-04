"use client";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScopedI18n } from "@/locales/client";
import { useCurrentUser } from "@/lib/context/use-current-user";
import Link from "next/link";
import supabaseClient from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Avatar, { genConfig } from "react-nice-avatar";
import { IconExternalLink } from "@tabler/icons-react";
import Feedback from "@/components/header/chat/feedback";
import Account from "@/components/header/chat/account";

export default function UserMenu() {
  const t = useScopedI18n("ModalAccount");
  const router = useRouter();

  const { userDetails } = useCurrentUser();

  const config = genConfig(userDetails?.full_name ?? "Avatar");

  if (!userDetails) {
    return (
      <div className="flex items-center justify-between">
        <Avatar
          className="h-8 w-8 rounded-full object-cover shadow-sm transition-opacity duration-300 hover:opacity-80"
          {...config}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div role="button" className="cursor-pointer">
            {userDetails.avatar_url ? (
              <Image
                className="h-8 w-8 select-none rounded-full shadow-sm transition-opacity duration-300 hover:opacity-80"
                src={userDetails.avatar_url}
                alt={userDetails.full_name ?? "Avatar"}
                height={48}
                width={48}
              />
            ) : (
              <Avatar
                className="h-8 w-8 rounded-full object-cover shadow-sm transition-opacity duration-300 hover:opacity-80"
                {...config}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="end" className="w-full p-2">
          <DropdownMenuLabel className="flex-col items-start py-2">
            <div className="font-medium">{userDetails.full_name}</div>
            <div className="font-normal text-muted-foreground">
              {userDetails.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuLabel className="cursor-pointer rounded-sm py-2 font-normal transition-colors hover:bg-accent">
            <Account className="w-full" />
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuLabel className="cursor-pointer rounded-sm py-2 font-normal transition-colors hover:bg-accent">
            <Feedback className="w-full" />
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full cursor-pointer items-center justify-between"
            >
              {t("homepage")}
              <IconExternalLink className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await supabaseClient.auth.signOut();
              router.replace("/auth/login");
            }}
            className="cursor-pointer py-2"
          >
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
