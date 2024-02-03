import axios from "axios"
import useSWR from "swr"

import type { Chat } from "@/types/types"

type ResponseData = {
  userChatHistory: Chat[]
}

const fetcher = (url: string): Promise<ResponseData> =>
  axios.get(url).then(res => res.data)

export default function useChatHistory(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<ResponseData>(
    userId ? `/api/app/get-user-chat/${userId}` : null,
    fetcher,
    {
      refreshWhenHidden: true,
      revalidateOnMount: true,
      refreshWhenOffline: true
    }
  )

  return {
    userChatHistory: data?.userChatHistory,
    isLoading,
    isError: error,
    mutate
  }
}
