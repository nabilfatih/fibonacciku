"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import type { Chat, ServerActionResult, ShowChatMessage } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconSpinner } from "@/components/ui/icons";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { useScopedI18n } from "@/locales/client";
import moment from "moment";

type ShareChatProps = {
  sharePath: string;
  id: string;
  user_id: string;
  chat_id: string;
  created_at: string;
};

interface ChatShareDialogProps extends DialogProps {
  chat: Pick<Chat, "id" | "title"> & {
    message: ShowChatMessage[];
    type: string;
    createdAt: string;
  };
  shareChat: (id: string, type: string) => ServerActionResult<ShareChatProps>;
  onCopy: () => void;
}

export function ChatShareDialog({
  chat,
  shareChat,
  onCopy,
  ...props
}: ChatShareDialogProps) {
  const t = useScopedI18n("ModalShareChat");

  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
  const [isSharePending, startShareTransition] = React.useTransition();

  const copyShareLink = React.useCallback(
    async (chat: ShareChatProps) => {
      const url = new URL(window.location.href);
      url.pathname = chat.sharePath;
      copyToClipboard(url.toString());
      onCopy();
      toast.success(t("link-copied"));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copyToClipboard, onCopy]
  );

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("share-chat")}</DialogTitle>
          <DialogDescription>{t("desc-share-chat")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1 rounded-md border p-4 text-sm">
          <div className="font-medium">{chat.title}</div>
          <div className="text-muted-foreground">
            {chat.message.length} {t("messages")} ·{" "}
            {moment(chat.createdAt).format("MMM DD, YYYY")}
          </div>
        </div>
        <DialogFooter className="items-center">
          <Button
            disabled={isSharePending}
            onClick={() => {
              startShareTransition(async () => {
                const result = await shareChat(chat.id, chat.type);

                if (result && "error" in result) {
                  toast.error(result.error);
                  return;
                }

                copyShareLink(result);
              });
            }}
          >
            {isSharePending ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                {t("copying")}...
              </>
            ) : (
              <>{t("copy-link")}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
