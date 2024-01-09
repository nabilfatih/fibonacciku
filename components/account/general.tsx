import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
  userId: string;
};

export default async function AccountGeneral({ userId }: Props) {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .maybeSingle();

  if (!data) {
    await supabase.auth.signOut();
    redirect("/auth/login?next=/account");
  }

  return (
    <section className="mx-auto max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Hi {data.full_name} 👋</CardTitle>
          <CardDescription>
            You can update your account information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid"></div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild>
            <Link href="/account/contact">Contact us</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
