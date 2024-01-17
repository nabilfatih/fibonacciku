import supabaseClient from "."

export const getUserLibrary = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from("libraries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    throw error
  }
  return data
}

export const getLibraryByUserId = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from("libraries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export const updateLibraryName = async (libraryId: string, name: string) => {
  const { error } = await supabaseClient
    .from("libraries")
    .update({ name })
    .eq("id", libraryId)

  if (error) {
    throw error
  }
}

export const deleteLibrary = async (libraryId: string) => {
  const { error } = await supabaseClient
    .from("libraries")
    .delete()
    .eq("id", libraryId)

  if (error) {
    throw error
  }
}
