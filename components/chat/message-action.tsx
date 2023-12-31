import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import ChatMessageActionSpeech from "@/components/chat/message-action-speech";
import ChatMessageActionPagination from "@/components/chat/message-action-pagination";
import type { IndexMessage } from "@/types/types";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  content: string;
  createdAt: string;
  currentIndex: IndexMessage;
  contentLength: number;
  isAssistant: boolean;
}

export default function ChatMessageActions({
  content,
  createdAt,
  className,
  currentIndex,
  contentLength,
  isAssistant,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(content);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2",
        className
      )}
      {...props}
    >
      <span className="text-xs text-muted-foreground">{createdAt}</span>
      <div className="flex items-center">
        {isAssistant && contentLength > 1 && (
          <ChatMessageActionPagination
            currentIndex={currentIndex}
            contentLength={contentLength}
          />
        )}

        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? (
            <IconCheck className="h-4 w-4" />
          ) : (
            <IconCopy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy message</span>
        </Button>
        <ChatMessageActionSpeech text={content} />
      </div>
    </div>
  );
}
