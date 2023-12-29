import { useMediaQuery } from "@/lib/hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconUser } from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";

type Props = {
  className?: string;
};

export default function Account({ className }: Props) {
  const t = useScopedI18n("ModalAccount");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState<boolean>(false);

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={cn(
              "inline-flex w-full items-center justify-between",
              className
            )}
          >
            {t("account")}
            <IconUser className="ml-2 h-4 w-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("account")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("close")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className={cn(
            "inline-flex w-full items-center justify-between",
            className
          )}
        >
          {t("account")}
          <IconUser className="ml-2 h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("account")}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
