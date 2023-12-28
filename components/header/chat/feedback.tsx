"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSpinner } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/lib/context/use-current-user";
import { useScopedI18n } from "@/locales/client";
import { IconSend } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function Feedback() {
  const t = useScopedI18n("ModalFeedback");

  const { userDetails } = useCurrentUser();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!userDetails) return;
    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/email/contact",
        {
          email: userDetails.email,
          subject: "Feedback Form",
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        setMessage("");
        toast.success(t("message-send"));
      }
      if (res.status === 400) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(t("something-wrong"));
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("feedback")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("feedback")}</DialogTitle>
          <DialogDescription>{t("desc-feedback")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("message-placeholder")}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IconSend className="mr-2 h-4 w-4" />
            )}{" "}
            {t("send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
