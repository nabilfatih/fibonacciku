import { IconSeparator } from "@/components/ui/icons";
import { createClientServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

async function UserOrLogin() {
  const cookieStore = cookies();
  const supabase = createClientServer(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <>
      {/* {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/" target="_blank" rel="nofollow">
          <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
          <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
        </Link>
      )} */}
      <div className="flex items-center">
        <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
        {/* {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )} */}
      </div>
    </>
  );
}

export function HeaderChat() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-muted px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {
          // navbar-end
        }
      </div>
    </header>
  );
}
