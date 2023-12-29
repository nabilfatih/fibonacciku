import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingChatHistory() {
  return (
    <div className="flex flex-col gap-2 overflow-auto px-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-9 w-full shrink-0 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
