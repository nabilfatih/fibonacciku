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
import Feedback from "./feedback";

export default function UserMenu() {
  const t = useScopedI18n("ModalAccount");
  const router = useRouter();

  const { userDetails } = useCurrentUser();

  const config = genConfig(userDetails?.full_name ?? "Avatar");

  if (!userDetails) {
    return (
      <div className="flex items-center justify-between">
        <Avatar
          className="h-8 w-8 rounded-full object-cover transition-opacity duration-300 hover:opacity-80"
          {...config}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            {userDetails.avatar_url ? (
              <Image
                className="h-8 w-8 select-none rounded-full transition-opacity duration-300 hover:opacity-80"
                src={userDetails.avatar_url}
                alt={userDetails.full_name ?? "Avatar"}
                height={48}
                width={48}
              />
            ) : (
              <Avatar
                className="h-8 w-8 rounded-full object-cover transition-opacity duration-300 hover:opacity-80"
                {...config}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="end" className="w-full">
          <DropdownMenuLabel className="flex-col items-start">
            <div className="font-medium">{userDetails.full_name}</div>
            <div className="font-normal text-zinc-500">{userDetails.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="rounded-xl font-normal transition-colors hover:bg-accent">
            <Feedback className="w-full" />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
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
              router.refresh();
            }}
            className="cursor-pointer"
          >
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
