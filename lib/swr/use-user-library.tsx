import { cache } from "react"
import useSWR from "swr"

import type { Libraries } from "@/types/types"

import { getUserLibrary } from "@/app/actions/library"

const fetcher = cache(async (): Promise<Libraries[]> => {
  const response = await getUserLibrary()
  if ("error" in response) {
    return []
  }
  return response.data
})

type Props = {
  userId: string
}

export default function useUserLibrary({ userId }: Props) {
  // if userId is empty string, return not fetch
  const { data, error, isLoading, isValidating, mutate } = useSWR<Libraries[]>(
    userId ? `user-library-${userId}` : null,
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
