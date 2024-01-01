import { cn } from "@/lib/utils";
import type { Libraries } from "@/types/types";

export interface LibraryProps extends React.ComponentProps<"div"> {
  libraries: Libraries[];
}

export default function LibraryDocument({ className, libraries }: LibraryProps) {
  return <div className={cn("pt-4 md:pt-10", className)}></div>;
}
