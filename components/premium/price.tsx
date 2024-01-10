"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  getPrice,
  getUserCurrency,
  priceList,
} from "@/lib/premium/helpers";
import type { Subscription } from "@/types/types";
import type { User } from "@supabase/supabase-js";
import useSWR from "swr";
import { useCallback, useMemo, useState } from "react";
import { cn, postData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { Button } from "../ui/button";
import { IconGift } from "@tabler/icons-react";
import { getStripe } from "@/lib/stripe/client";
import { toast } from "sonner";
import { IconSpinner } from "../ui/icons";

type Props = {
  user: User | null;
  subscription: Subscription | null;
};

export default function PremiumPrice({ user, subscription }: Props) {
  const { data } = useSWR("user-currency", getUserCurrency);
  const router = useRouter();
  const t = useScopedI18n("MarketingPricing");

  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const currency = useMemo(() => data || "usd", [data]);

  const handleChoosePlan = useCallback(
    async (price: (typeof priceList)[0]) => {
      if (price.redirect) return router.push("/contact");
      if (!user) return router.push("/auth/login?next=/premium");

      setPriceIdLoading(price.priceId);

      let url = "/api/payment/create-checkout-session";
      if (currency === "idr") {
        url = "/api/payment/xendit/checkout";
      }

      try {
        const response = await postData({
          url,
          data: {
            price,
            currency,
            quantity: 1,
          },
        });
        if (response.provider === "stripe") {
          const sessionId = response.sessionId;
          const stripe = await getStripe();
          stripe?.redirectToCheckout({ sessionId });
        } else if (response.provider === "xendit") {
          const invoiceUrl = response.invoiceUrl;
          router.push(invoiceUrl);
        } else {
          throw new Error("Unknown payment provider");
        }
      } catch (error) {
        return alert((error as Error)?.message);
      } finally {
        setPriceIdLoading(undefined);
      }
    },
    [currency, router, user]
  );

  return (
    <section className="mx-auto max-w-4xl px-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {priceList.map((price, index) => {
          const plan = price.plan;
          // get the price from the key of the price object, based on currency
          const priceData = getPrice(plan, currency, price.type);

          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="uppercase text-primary">
                  {price.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="inline-block whitespace-nowrap align-bottom">
                    <span className="align-bottom text-3xl font-semibold tabular-nums">
                      {formatCurrency(priceData, currency, price.type)}
                    </span>
                    <span className="leading-none">
                      {" "}
                      /{" "}
                      {t(
                        price.type === "yearly"
                          ? ("year" as never)
                          : ("month" as never)
                      )}
                    </span>
                  </div>

                  {currency !== "idr" && (
                    <p className="flex items-center gap-2 text-sm text-primary">
                      <IconGift className="h-4 w-4" />
                      {t("7-free-trial")}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    if (subscription?.price_id === price.priceId) {
                      router.push("/account");
                      toast(t("see-account"), {
                        icon: <span className="ml-2">👀</span>,
                      });
                      return;
                    }
                    handleChoosePlan(price);
                  }}
                  className="w-full"
                  disabled={typeof priceIdLoading === "string"}
                >
                  {priceIdLoading === price.priceId && (
                    <IconSpinner className="mr-2 animate-spin" />
                  )}
                  {t("get-started")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
