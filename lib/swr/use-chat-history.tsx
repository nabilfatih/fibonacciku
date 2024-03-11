import { cache } from "react"
import useSWR from "swr"

import type { Chat } from "@/types/types"

import { getUserChat } from "@/app/actions/chat"

const fetcher = cache(async (): Promise<Chat[]> => {
  const response = await getUserChat()
  if ("error" in response) {
    return []
  }
  return response.data
})

type Props = {
  userId: string
}

export default function useChatHistory({ userId }: Props) {
  const { data, error, isLoading, mutate } = useSWR<Chat[]>(
    userId ? `user-chat-${userId}` : null,
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
