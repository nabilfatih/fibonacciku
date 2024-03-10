import useSWR from "swr"

import type { Libraries } from "@/types/types"

import { getUserLibrary } from "@/app/actions/library"

const fetcher = async (): Promise<Libraries[]> => {
  const response = await getUserLibrary()
  if ("error" in response) {
    return []
  }
  return response.data
}

export default function useUserLibrary() {
  // if userId is empty string, return not fetch
  const { data, error, isLoading, isValidating, mutate } = useSWR<Libraries[]>(
    "user-library",
    fetcher,
    {
      refreshWhenHidden: true,
      revalidateOnMount: true,
      refreshWhenOffline: true
    }
  )

  return {
    libraries: data,
    mutate,
    isLoading,
    isError: error,
    isValidating
  }
}
