import supabaseClient from "."

export const uploadBooksFile = async (
  file: File,
  bookId: string,
  fileId: string
) => {
  const { data, error } = await supabaseClient.storage
    .from("books")
    .upload(`${bookId}/${fileId}`, file, {
      cacheControl: "3600",
      upsert: true
    })
  if (error) {
    throw error
  }
  return data
}

export const uploadBooksCoverFile = async (
  cover: File,
  bookId: string,
  coverId: string
) => {
  const { data, error } = await supabaseClient.storage
    .from("books")
    .upload(`${bookId}/${coverId}`, cover, {
      cacheControl: "3600",
      upsert: true
    })
  if (error) {
    throw error
  }
  return data
}

export const downloadBooksFile = async (bookId: string, fileId: string) => {
  const { data, error } = await supabaseClient.storage
    .from("books")
    .download(`${bookId}/${fileId}`)
  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export const deleteBooksFile = async (bookId: string, fileId: string) => {
  const { error } = await supabaseClient.storage
    .from("books")
    .remove([`${bookId}/${fileId}`])
  if (error) {
    throw error
  }
}

export const deleteBooksCoverFile = async (bookId: string, coverId: string) => {
  const { error } = await supabaseClient.storage
    .from("books")
    .remove([`${bookId}/${coverId}`])
  if (error) {
    throw error
  }
}

export const getBooksCoverPublicUrl = (
  bookId: string,
  fileId: string
): string => {
  const { data } = supabaseClient.storage
    .from("books")
    .getPublicUrl(`${bookId}/cover_${fileId}`)

  return data.publicUrl
}

export const getBooksFileSignedUrl = async (
  bookId: string,
  fileId: string
): Promise<string> => {
  const { data, error } = await supabaseClient.storage
    .from("books")
    .createSignedUrl(`${bookId}/${fileId}`, 60 * 60 * 24)
  if (error) {
    throw error
  }

  return data.signedUrl
}
