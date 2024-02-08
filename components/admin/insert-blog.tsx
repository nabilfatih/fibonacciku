"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import type { Blogs } from "@/types/types"
import {
  deleteBlogs,
  deleteBlogsCoverFile,
  insertBlogs,
  uploadBlogsCoverFile
} from "@/lib/supabase/client/blogs"
import { generateNanoID, generateUUID, getCurrentDate } from "@/lib/utils"

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
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
  title: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, { message: "Only use a-z, A-Z, 0-9, and dash" })
    .min(3, { message: "Title is too short" })
    .max(100, { message: "Title is too long" }),
  description: z
    .string()
    .min(3, { message: "Description is too short" })
    .max(200, { message: "Description is too long" }),
  content: z.string().min(1, { message: "Content is required" }),
  coverFile: z.instanceof(File).nullable(),
  authors: z.string().min(1, { message: "Authors are required" }),
  tags: z.string().min(1, { message: "Tags are required" })
})

export default function AdminInsertBlog() {
  const [isLoading, setIsLoading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      coverFile: null,
      authors: "",
      tags: ""
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

    const blogId = generateUUID()
    const fileId = `cover__${generateNanoID()}`

    const dataBlogs: Blogs = {
      id: blogId,
      title: data.title,
      description: data.description,
      content: data.content,
      authors: data.authors.split(",").join(", "),
      tags: data.tags.split(", ").join(", "),
      seen: 0,
      cover: fileId,
      slug: data.title.toLowerCase().split(" ").join("-"),
      created_at: getCurrentDate(),
      updated_at: getCurrentDate()
    }

    try {
      setIsLoading(true)

      await Promise.all([
        uploadBlogsCoverFile(data.coverFile, blogId, fileId),
        insertBlogs(dataBlogs)
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
      await Promise.all([
        deleteBlogsCoverFile(blogId, fileId),
        deleteBlogs(blogId)
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>
                Title of the blog. Max 100 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                Description of the blog. Max 200 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          rules={{ required: "Content is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Content" {...field} />
              </FormControl>
              <FormDescription>
                Content of the blog. Please beautify first the content before
                input here. Search on google: &#34;beautify markdown
                online&#34;.
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

        <FormField
          control={form.control}
          name="authors"
          rules={{ required: "Authors is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <FormControl>
                <Input placeholder="Full name separated by comma" {...field} />
              </FormControl>
              <FormDescription>Authors of the blog.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          rules={{ required: "Tags is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Announcement, News, Product, etc"
                  {...field}
                />
              </FormControl>
              <FormDescription>Tags of the blog.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          Submit
          {isLoading && <IconSpinner className="ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  )
}
