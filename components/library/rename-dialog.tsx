"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { toast } from "sonner"

import type { Libraries, ServerActionResult } from "@/types/types"
import { useMediaQuery } from "@/lib/hooks/use-media-query"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LibraryRenameDialogProps extends DialogProps {
  library: Pick<Libraries, "id" | "name">
  renameLibrary: (id: string, title: string) => ServerActionResult<void>
  onRename: () => void
}

export function LibraryRenameDialog({
  library,
  renameLibrary,
  onRename,
  ...props
}: LibraryRenameDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [title, setTitle] = React.useState<string>(library.name)

  const [isRenamePending, startRenameTransition] = React.useTransition()

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename this document</DialogTitle>
            <DialogDescription>
              Change the name of this document to something more meaningful.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Document name</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Write a name for this document"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter className="items-center">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              disabled={isRenamePending || !title.trim()}
              onClick={() => {
                startRenameTransition(async () => {
                  const result = await renameLibrary(library.id, title)

                  if (result && "error" in result) {
                    toast.error(result.error)
                    return
                  }

                  onRename()
                  toast.success("Chat renamed")
                })
              }}
            >
              {isRenamePending ? (
                <>
                  <IconSpinner className="mr-2 animate-spin" />
                  Renaming...
                </>
              ) : (
                <>Rename</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Rename this document</DrawerTitle>
          <DrawerDescription>
            Change the name of this document to something more meaningful.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Document name</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Write a name for this document"
              className="w-full"
            />
          </div>

          <Button
            disabled={isRenamePending || !title.trim()}
            onClick={() => {
              startRenameTransition(async () => {
                const result = await renameLibrary(library.id, title)

                if (result && "error" in result) {
                  toast.error(result.error)
                  return
                }

                onRename()
                toast.success("Chat renamed")
              })
            }}
          >
            {isRenamePending ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                Renaming...
              </>
            ) : (
              <>Rename</>
            )}
          </Button>
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
