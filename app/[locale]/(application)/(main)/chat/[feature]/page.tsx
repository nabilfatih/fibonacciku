import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatMessage from "@/components/chat";

type Props = {
  params: { feature: string };
};

export default async function ChatFeaturePage({ params }: Props) {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect(`/auth/login?next=/chat/${params.feature}`);
  }

  return (
    <ChatMessage
      userId={session.user.id}
      type={params.feature as "assistant" | "document"}
    />
  );
}
