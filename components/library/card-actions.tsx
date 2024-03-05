import React from "react"
import { useRouter } from "next/navigation"
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import type { Libraries } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { IconSpinner } from "@/components/ui/icons"
import { LibraryRenameDialog } from "@/components/library/rename-dialog"
import { removeLibrary, renameLibrary } from "@/app/actions/library"

type Props = {
  className: string
  library: Libraries
}

export default function LibraryCardActions({ className, library }: Props) {
  const t = useScopedI18n("RenameDialog")
  const tDelete = useScopedI18n("DeleteDialog")
  const router = useRouter()

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

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
        <DropdownMenuContent align="start" className="w-full">
          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2"
            onClick={() => {
              setRenameDialogOpen(true)
            }}
          >
            <IconPencil className="h-4 w-4" />
            <span>{t("rename")}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            role="button"
            className="cursor-pointer space-x-2"
            onClick={() => {
              setDeleteDialogOpen(true)
            }}
          >
            <IconTrash className="h-4 w-4" />
            <span>{t("delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LibraryRenameDialog
        library={{
          id: library.id,
          name: library.name
        }}
        renameLibrary={renameLibrary}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onRename={() => setRenameDialogOpen(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tDelete("title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tDelete("remove")} {library.name}.{" "}
              {tDelete("delete-document-desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending || library.status === "processing"}
              onClick={event => {
                event.preventDefault()

                startRemoveTransition(async () => {
                  const result = await removeLibrary(
                    library.id,
                    library.file_id
                  )

                  if (result && "error" in result) {
                    toast.error(result.error)
                    return
                  }

                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push("/library")
                  toast.success(tDelete("document-deleted"))
                })
              }}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
