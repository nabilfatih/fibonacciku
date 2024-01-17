import useSWR from "swr"
import axios from "axios"
import type { Chat } from "@/types/types"

type ResponseData = {
  userChatHistory: Chat[]
}

const fetcher = (url: string): Promise<ResponseData> =>
  axios.get(url).then(res => res.data)

export default function useChatHistory(userId: string) {
  const { data, error, isLoading } = useSWR<ResponseData>(
    `/api/auth/get-user-chat/${userId}`,
    fetcher
  )

  return {
    userChatHistory: data?.userChatHistory,
    isLoading,
    isError: error
  }
}
