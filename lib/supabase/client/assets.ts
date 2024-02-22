import supabaseClient from "."

export const uploadAssetsFile = async (file: File, name: string) => {
  const { data, error } = await supabaseClient.storage
    .from("assets")
    .upload(name, file, {
      cacheControl: "3600",
      upsert: true
    })
  if (error) {
    throw error
  }
  return data
}

export const getAssetsPublicUrl = (name: string) => {
  const { data } = supabaseClient.storage.from("assets").getPublicUrl(name)

  return data.publicUrl
}

export const deleteAssetsFile = async (name: string) => {
  const { error } = await supabaseClient.storage.from("assets").remove([name])
  if (error) {
    throw error
  }
}
