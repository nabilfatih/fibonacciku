import useSWR from "swr"

import type { Chat } from "@/types/types"

import { getUserChat } from "@/app/actions/chat"

const fetcher = async (): Promise<Chat[]> => {
  const response = await getUserChat()
  if ("error" in response) {
    return []
  }
  return response.data
}

export default function useChatHistory() {
  const { data, error, isLoading, mutate } = useSWR<Chat[]>(
    "user-chat-history",
    fetcher,
    {
      refreshWhenHidden: true,
      revalidateOnMount: true,
      refreshWhenOffline: true
    }
  )

  return {
    userChatHistory: data,
    isLoading,
    isError: error,
    mutate
  }
}
