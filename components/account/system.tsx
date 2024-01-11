import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AccountLogout from "@/components/account/logout";
import Feedback from "@/components/header/feedback";

export default function AccountSystem() {
  return (
    <section className="mx-auto max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
          <CardDescription>
            Fibo loves you and we hope you love Fibo too.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <Feedback variant="outline" className="w-auto" />
          <AccountLogout />
        </CardFooter>
      </Card>
    </section>
  );
}
