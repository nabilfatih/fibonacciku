"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { KeyedMutator } from "swr"
import { createContext, useContextSelector } from "use-context-selector"

import type { Subscription, UserDetails } from "@/types/types"
import supabaseClient from "@/lib/supabase/client"
import useUser, { type ResponseDataUseUser } from "@/lib/swr/use-user"

// Define type for context value
type CurrentUserContextValue = {
  user: User | null
  userDetails: UserDetails | null
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>
  subscription: Subscription | null
  setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>
  isLoading: boolean
  handleClearCurrentUserData: () => void
  mutate: KeyedMutator<ResponseDataUseUser>
}

// Create context
export const CurrentUserContext = createContext<
  CurrentUserContextValue | undefined
>(undefined)

// Define props type
type CurrentUserContextProviderProps = {
  children: React.ReactNode
  user: User | null
}

// Define provider component
export const CurrentUserContextProvider: React.FC<
  CurrentUserContextProviderProps
> = ({ user, children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  const {
    userDetails: userData,
    subscription: subscriptionData,
    isLoading,
    mutate
  } = useUser({ userId: user?.id ?? "" })

  useEffect(() => {
    if (userData) setUserDetails(userData)
    if (subscriptionData) setSubscription(subscriptionData)
    return () => {
      setUserDetails(null)
      setSubscription(null)
    }
  }, [subscriptionData, userData])

  const handleClearCurrentUserData = useCallback(() => {
    setUserDetails(null)
    setSubscription(null)
  }, [])

  const handleChanges = useCallback(
    ({ eventType, table, new: newPayload }: any) => {
      if (
        eventType === "DELETE" &&
        ["users", "subscriptions"].includes(table)
      ) {
        if (table === "users") {
          setUserDetails(null)
        } else {
          setSubscription(null)
        }
      } else if (
        eventType === "UPDATE" &&
        ["users", "subscriptions"].includes(table)
      ) {
        if (table === "users") {
          setUserDetails(newPayload)
        } else {
          setSubscription(newPayload)
        }
      }
    },
    []
  )

  useEffect(() => {
    if (!userDetails) return

    const events = ["UPDATE", "DELETE"]
    const tables = ["users", "subscriptions"]
    const channel = supabaseClient.channel("user-data")

    events.forEach(event => {
      tables.forEach(table => {
        const filter =
          table === "users"
            ? `id=eq.${userDetails.id}`
            : `user_id=eq.${userDetails.id}`
        channel.on(
          //@ts-ignore
          "postgres_changes",
          { event, schema: "public", table, filter },
          handleChanges
        )
      })
    })

    channel.subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [handleChanges, userDetails])

  const value = useMemo(
    () => ({
      user,
      userDetails,
      setUserDetails,
      subscription,
      setSubscription,
      isLoading,
      handleClearCurrentUserData,
      mutate
    }),
    [
      handleClearCurrentUserData,
      isLoading,
      mutate,
      user,
      subscription,
      userDetails
    ]
  )

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}

// Custom hook for using the context
export const useCurrentUser = () => {
  const context = useContextSelector(CurrentUserContext, value => value)
  if (context === undefined) {
    throw new Error(
      `useCurrentUser must be used within a CurrentUserContextProvider.`
    )
  }
  return context
}
