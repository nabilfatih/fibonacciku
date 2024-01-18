import axios from "axios"
import useSWR from "swr"

import type { Subscription, UserDetails } from "@/types/types"

type ResponseData = {
  userDetails: UserDetails
  subscription: Subscription
}

const fetcher = (url: string): Promise<ResponseData> =>
  axios.get(url).then(res => res.data)

export default function useUser(userId: string) {
  const { data, error, isLoading, isValidating } = useSWR<ResponseData>(
    userId ? `/api/auth/get-user/${userId}` : null,
    fetcher
  )

  return {
    userDetails: data?.userDetails,
    subscription: data?.subscription,
    isLoading,
    isError: error,
    isValidating
  }
}
