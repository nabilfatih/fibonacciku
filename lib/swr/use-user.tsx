import { cache } from "react"
import useSWR from "swr"

import type { Subscription, UserDetails } from "@/types/types"

import { getUser } from "@/app/actions/users"

export type ResponseDataUseUser = {
  userDetails: UserDetails | null
  subscription: Subscription | null
}

const fetcher = cache(async (): Promise<ResponseDataUseUser> => {
  const response = await getUser()
  if ("error" in response) {
    return {
      userDetails: null,
      subscription: null
    }
  }
  return response
})

type Props = {
  userId: string
}

export default function useUser({ userId }: Props) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ResponseDataUseUser>(
      userId ? `user-data-${userId}` : null,
      fetcher,
      {
        refreshWhenHidden: true,
        revalidateOnMount: true,
        refreshWhenOffline: true
      }
    )

  return {
    userDetails: data?.userDetails,
    subscription: data?.subscription,
    isLoading,
    isError: error,
    isValidating,
    mutate
  }
}
