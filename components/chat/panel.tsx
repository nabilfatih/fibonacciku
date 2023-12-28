import * as React from "react";
import { type UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import ButtonScrollToBottom from "@/components/chat/button-scroll-to-bottom";
import { IconStop } from "@/components/ui/icons";
import FooterText from "@/components/chat/footer";
import { IconRefresh } from "@tabler/icons-react";
import PromptForm from "./form";
import type { ShowChatMessage } from "@/types/types";

export type ChatPanelProps = {
  isLoading: boolean;
  messages: ShowChatMessage[];
  id?: string;
};

export function ChatPanel({ id, messages, isLoading }: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [input, setInput] = React.useState("");

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-background/10 dark:from-10% dark:to-background/80">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-12 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2 h-5 w-5" />
              Stop generating
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                <Button variant="outline">
                  <IconRefresh className="mr-2 h-5 w-5" />
                  Regenerate response
                </Button>
              </div>
            )
          )}
        </div>
        <div className="space-y-2 border-t bg-background px-4 py-2 shadow-lg sm:border-none">
          <PromptForm
            onSubmit={async (value) => {}}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
