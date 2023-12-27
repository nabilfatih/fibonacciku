import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingChatHistory() {
  return (
    <div className="mt-2 flex flex-1 flex-col space-y-4 overflow-auto px-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 w-full shrink-0 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
