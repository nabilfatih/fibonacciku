"use client";

import { useScopedI18n } from "@/locales/client";
import type { Subscription } from "@/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconSpinner } from "@/components/ui/icons";
import { postData } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  subscription: Subscription;
};

export default function SubscriptionManageButton({ subscription }: Props) {
  const t = useScopedI18n("ModalSubscription");

  const [portalLoading, setPortalLoading] = useState(false);

  const redirectToCustomerPortal = async () => {
    setPortalLoading(true);

    try {
      const { url, error } = await postData({
        url: "/api/payment/create-portal-link",
      });
      if (error) return toast.error((error as Error).message);
      window.location.assign(url);
    } catch (error) {
      if (error) return toast.error((error as Error).message);
    }
    setPortalLoading(false);
  };

  if (subscription.provider !== "stripe") {
    return (
      <Button asChild>
        <Link href="/premium">{t("see-premium")}</Link>;
      </Button>
    );
  }
  return (
    <Button disabled={portalLoading} onClick={redirectToCustomerPortal}>
      {portalLoading && <IconSpinner className="mr-2 animate-spin" />}
      {t("manage-plan")}
    </Button>
  );
}
