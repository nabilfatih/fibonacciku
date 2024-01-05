import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { Libraries } from "@/types/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconSpinner } from "@/components/ui/icons";
import { removeLibrary, renameLibrary } from "@/app/actions";
import { LibraryRenameDialog } from "./rename-dialog";

type Props = {
  className: string;
  library: Libraries;
};

export default function LibraryCardActions({ className, library }: Props) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [isRemovePending, startRemoveTransition] = React.useTransition();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
            className={cn(className)}
          >
            <IconDots className="h-5 w-5" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full p-2">
          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2"
            onClick={() => {
              setRenameDialogOpen(true);
            }}
          >
            <IconPencil className="h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2 !text-destructive"
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
          >
            <IconTrash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LibraryRenameDialog
        library={{
          id: library.id,
          name: library.name,
        }}
        renameLibrary={renameLibrary}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onRename={() => setRenameDialogOpen(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove {library.name}. This will permanently delete your document
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending || library.status === "processing"}
              onClick={event => {
                event.preventDefault();

                startRemoveTransition(async () => {
                  const result = await removeLibrary(
                    library.id,
                    library.file_id
                  );

                  if (result && "error" in result) {
                    toast.error(result.error);
                    return;
                  }

                  setDeleteDialogOpen(false);
                  router.refresh();
                  router.push("/chat/library");
                  toast.success("Document deleted");
                });
              }}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
