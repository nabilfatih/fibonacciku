import type { Subscription } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScopedI18n } from "@/locales/server";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Label } from "@/components/ui/label";
import SubscriptionManageButton from "@/components/account/subscription-manage-button";

type Props = {
  subscription: Subscription;
};

export default async function AccountSubscriptionManage({
  subscription,
}: Props) {
  const t = await getScopedI18n("ModalSubscription");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <div className="flex flex-row items-center gap-2">
          <CardDescription>{t("plan-summary")}</CardDescription>
          <Badge>{t(subscription.planName as never)}</Badge>
          {subscription.status === "trialing" && (
            <Badge variant="outline">{t("trial")}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 pb-6">
          <div className="flex flex-col items-start gap-2">
            <Label className="text-xs text-muted-foreground">
              {t("start-date")}
            </Label>
            <p className="text-sm leading-none">
              {moment(subscription.current_period_start).format("MMM D, YYYY")}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Label className="text-xs text-muted-foreground">
              {t("end-date")}
            </Label>
            <p className="text-sm leading-none">
              {moment(subscription.current_period_end).format("MMM D, YYYY")}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {moment(subscription.current_period_end).diff(moment(), "days")}{" "}
          {t("days-left")}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <SubscriptionManageButton subscription={subscription} />
      </CardFooter>
    </Card>
  );
}
