import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import ChatMessageActionSpeech from "@/components/chat/message-action-speech";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  content: string;
  createdAt: string;
}

export function ChatMessageActions({
  content,
  createdAt,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(content);
  };

  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <span className="text-xs text-muted-foreground">{createdAt}</span>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? (
            <IconCheck className="h-5 w-5" />
          ) : (
            <IconCopy className="h-5 w-5" />
          )}
          <span className="sr-only">Copy message</span>
        </Button>
        <ChatMessageActionSpeech text={content} />
      </div>
    </div>
  );
}
