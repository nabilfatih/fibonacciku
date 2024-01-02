import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Sidebar } from "@/components/sidebar";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMessage } from "@/lib/context/use-message";
import { useScopedI18n } from "@/locales/client";

interface SidebarMobileProps extends DialogProps {
  children: React.ReactNode;
}

export default function SidebarDocument({
  children,
  ...props
}: SidebarMobileProps) {
  const t = useScopedI18n("FormChat");
  const { state, dispatch } = useMessage();
  return (
    <Sheet
      {...props}
      open={state.openDocument}
      onOpenChange={open =>
        dispatch({ type: "SET_OPEN_DOCUMENT", payload: open })
      }
    >
      <SheetContent
        side="right"
        className="h-auto w-full bg-muted sm:max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle>{t("document")}</SheetTitle>
        </SheetHeader>
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  );
}
