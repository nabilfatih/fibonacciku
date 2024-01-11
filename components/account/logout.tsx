"use client";

import { useScopedI18n } from "@/locales/client";
import { Button } from "../ui/button";
import supabaseClient from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";

export default function AccountLogout() {
  const t = useScopedI18n("ModalAccount");
  const router = useRouter();
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await supabaseClient.auth.signOut();
        router.replace("/auth/login");
      }}
    >
      <IconLogout className="mr-2 h-4 w-4" />
      {t("logout")}
    </Button>
  );
}
