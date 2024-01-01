import type { Libraries } from "@/types/types";
import { IconDots } from "@tabler/icons-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LibraryCardChatButton from "@/components/library/card-chat-button";

type Props = {
  library: Libraries;
  className?: string;
};

export default function LibraryCardInfo({ library, className }: Props) {
  return (
    <div
      className={cn(
        "hidden max-w-xs flex-none items-center sm:flex",
        className
      )}
    >
      <span className="mr-2 text-xs text-muted-foreground">
        {moment(library.created_at).fromNow()}
      </span>

      <LibraryCardChatButton library={library} />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        className="hidden sm:inline-flex"
      >
        <IconDots className="h-5 w-5" />
        <span className="sr-only">Actions</span>
      </Button>
    </div>
  );
}
