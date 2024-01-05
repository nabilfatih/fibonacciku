import useUserLibrary from "@/lib/swr/use-user-library";
import { isMobileOnly } from "react-device-detect";
import {
  IconChevronLeft,
  IconCircleFilled,
  IconFile,
} from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusToColor = (status: string) => {
  switch (status) {
    case "processing":
      return "text-warning animate-pulse";
    case "invalid":
      return "text-error";
    case "finished":
      return "text-success";
    default:
      return "";
  }
};

type Props = {
  userId: string;
};

export default function ChatLibrary({ userId }: Props) {
  const { libraries } = useUserLibrary(userId);

  const [pagination, setPagination] = useState<{
    start: number;
    end: number;
  }>({
    start: 0,
    end: isMobileOnly ? 2 : 4,
  });

  const isShowPagination = useMemo(() => {
    if (!libraries) return false;
    return libraries.length > (isMobileOnly ? 2 : 4);
  }, [libraries]);

  const finishedLibraries = useMemo(() => {
    if (!libraries) return [];
    const filteredLibraries = libraries.filter(
      library => library.status !== "invalid"
    );
    return filteredLibraries.slice(pagination.start, pagination.end);
  }, [libraries, pagination.end, pagination.start]);

  // Helper function to change pagination
  const changePagination = useCallback((delta: number) => {
    setPagination(prev => ({
      start: prev.start + delta,
      end: prev.end + delta,
    }));
  }, []);

  if (!libraries) return null;

  return (
    <div className="mt-6 grid">
      <p className="text-center text-muted-foreground">
        Then choose from your library:
      </p>
      <div className="mt-4">
        <div className="flex w-full items-center justify-between gap-2">
          {isShowPagination && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={pagination.start <= 0}
              onClick={() => changePagination(-1)}
            >
              <IconChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
          )}

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            {finishedLibraries.map((library, index) => (
              <motion.button
                key={library.id}
                type="button"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                initial="hidden"
                animate="visible"
                transition={{
                  delay: index * 0.05,
                  ease: "easeInOut",
                  duration: 0.5,
                }}
                viewport={{ amount: 0 }}
                className="inline-flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3 shadow-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex max-w-[10rem] items-start gap-2 sm:max-w-[12rem]">
                  <IconFile className="h-5 w-5 min-w-[1.25rem]" />
                  <span className="truncate text-sm">{library.name}</span>
                </div>

                <IconCircleFilled
                  className={cn(
                    "h-4 w-4 min-w-[1rem]",
                    statusToColor(library.status)
                  )}
                />
              </motion.button>
            ))}
          </div>
          {isShowPagination && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={pagination.end >= libraries.length}
              onClick={() => changePagination(1)}
            >
              <span className="sr-only">Next</span>
              <IconChevronLeft className="h-5 w-5 rotate-180" />
            </Button>
          )}
        </div>
      </div>
      <Link
        href="/chat/library"
        className="mx-auto mt-4 max-w-fit text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
      >
        See all your library
      </Link>
    </div>
  );
}
