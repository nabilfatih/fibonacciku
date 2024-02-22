"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  deleteAssetsFile,
  getAssetsPublicUrl,
  uploadAssetsFile
} from "@/lib/supabase/client/assets"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FormSchema = z.object({
  coverFile: z.instanceof(File).nullable(),
  imageName: z.string().min(1, { message: "Image name is required" })
})

export default function AdminUploadImage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const [url, setUrl] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coverFile: null,
      imageName: ""
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // check if all data is valid
    const isValid = await form.trigger()
    if (!isValid) {
      toast.error("Please fill all the fields correctly")
      return
    }
    // if coverFile is null, toast error
    if (!data.coverFile) {
      toast.error("Cover image is required")
      return
    }

    try {
      setIsLoading(true)

      const name = data.imageName.replace(/\s/g, "-").toLowerCase() // replace space with dash and convert to lowercase

      await uploadAssetsFile(data.coverFile, name)

      const publicUrl = getAssetsPublicUrl(name)
      setUrl(publicUrl)

      toast.success("Image uploaded successfully")
      // Clear the input value after each operation
      form.reset()
      // reset the coverFile input
      if (fileRef.current) {
        fileRef.current.value = ""
      }
    } catch (error) {
      toast.error("Failed to upload image")
      console.error("Failed to upload image", error)
      // delete data if failed to insert
      await deleteAssetsFile(data.imageName)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="imageName"
            rules={{ required: "Image name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Name</FormLabel>
                <FormControl>
                  <Input placeholder="Image Name" {...field} />
                </FormControl>
                <FormDescription>
                  Name of the image that will be used in the content. Must in
                  english.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <Label htmlFor="coverFile">Image</Label>
            <Input
              ref={fileRef}
              id="coverFile"
              type="file"
              multiple={false}
              accept="image/*"
              onChange={e => {
                // check if file selected
                if (e.target.files?.length) {
                  const file = e.target.files[0]
                  form.setValue("coverFile", file)
                }
              }}
            />
            <FormDescription>
              Image that will be used in the content.
            </FormDescription>
            <FormMessage />
          </div>

          <Button type="submit" disabled={isLoading}>
            Submit
            {isLoading && <IconSpinner className="ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>

      {url && (
        <div className="space-y-2">
          <h2 className="font-medium tracking-tight">Image URL</h2>
          <p className="tracking-tight">{url}</p>
        </div>
      )}
    </div>
  )
}
