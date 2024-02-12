"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  deleteBlogsCoverFile,
  updateBlogsCover,
  uploadBlogsCoverFile
} from "@/lib/supabase/client/blogs"
import { generateNanoID } from "@/lib/utils"

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
  blogId: z.string().uuid({ message: "Blog ID is not valid" }),
  coverFile: z.instanceof(File).nullable()
})

export default function AdminUploadImage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      blogId: "",
      coverFile: null
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

    const fileId = `cover__${generateNanoID()}`

    try {
      setIsLoading(true)

      await Promise.all([
        uploadBlogsCoverFile(data.coverFile, data.blogId, fileId),
        updateBlogsCover(data.blogId, fileId)
      ])

      toast.success("Blog inserted successfully")
      // Clear the input value after each operation
      form.reset()
      // reset the coverFile input
      if (fileRef.current) {
        fileRef.current.value = ""
      }
    } catch (error) {
      toast.error("Failed to insert blog")
      console.error("Failed to insert blog", error)
      // delete data if failed to insert
      await deleteBlogsCoverFile(data.blogId, fileId)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="blogId"
          rules={{ required: "Blog ID is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog ID</FormLabel>
              <FormControl>
                <Input placeholder="Blog ID" {...field} />
              </FormControl>
              <FormDescription>
                ID of the blog. See this in database, then copy paste.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <Label htmlFor="coverFile">Cover Image</Label>
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
            Image for the cover of the blog. Generate image using Fibo
          </FormDescription>
          <FormMessage />
        </div>

        <Button type="submit" disabled={isLoading}>
          Submit
          {isLoading && <IconSpinner className="ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  )
}
