import * as React from "react";

import { Button } from "@/components/ui/button";
import ButtonScrollToBottom from "@/components/chat/button-scroll-to-bottom";
import { IconStop } from "@/components/ui/icons";
import FooterText from "@/components/chat/footer";
import { IconRefresh, IconShare3 } from "@tabler/icons-react";
import PromptForm from "./form";
import type { ShowChatMessage } from "@/types/types";
import { useScopedI18n } from "@/locales/client";
import { ChatShareDialog } from "./share-dialog";
import { shareChat } from "@/app/actions";

export type ChatPanelProps = {
  isLoading: boolean;
  messages: ShowChatMessage[];
  type: "assistant" | "document";
  id?: string;
  title?: string;
  createdAt?: string;
};

export default function ChatPanel({
  id,
  messages,
  type,
  title,
  createdAt,
  isLoading,
}: ChatPanelProps) {
  const t = useScopedI18n("FormChat");

  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [input, setInput] = React.useState("");

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-muted/50 to-muted duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-transparent dark:via-background/50 dark:to-background">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="flex h-12 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2 h-5 w-5" />
              {t("stop-generating")}
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                <Button variant="outline">
                  <IconRefresh className="mr-2 h-5 w-5" />
                  {t("regenerate")}
                </Button>
                {id && title && createdAt && type ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare3 className="mr-2 h-5 w-5" />
                      {t("share")}
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        message: messages,
                        type,
                        created_at: createdAt,
                      }}
                    />
                  </>
                ) : null}
              </div>
            )
          )}
        </div>
        <div className="space-y-2 border-t bg-background p-2 sm:border-none sm:bg-transparent">
          <PromptForm
            onSubmit={async value => {}}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            type={type}
          />
          <FooterText
            className="hidden sm:block"
            text={
              type === "assistant"
                ? t("fibonacciku-make-mistake")
                : t("fibonacciku-answer-based-doc")
            }
          />
        </div>
      </div>
    </div>
  );
}
