"use client";

import type { Subscription, UserDetails } from "@/types/types";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useUser from "@/lib/swr/use-user";
import supabaseClient from "@/lib/supabase/client";

// Define type for context value
type CurrentUserContextValue = {
  session: Session | null;
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  subscription: Subscription | null;
  setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>;
  handleClearCurrentUserData: () => void;
};

// Create context
export const CurrentUserContext = createContext<
  CurrentUserContextValue | undefined
>(undefined);

// Define props type
type CurrentUserContextProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};

// Define provider component
export const CurrentUserContextProvider: React.FC<
  CurrentUserContextProviderProps
> = ({ session, children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const { userDetails: userData, subscription: subscriptionData } = useUser(
    session?.user?.id ?? ""
  );

  useEffect(() => {
    if (userData) setUserDetails(userData);
    if (subscriptionData) setSubscription(subscriptionData);
    return () => {
      setUserDetails(null);
      setSubscription(null);
    };
  }, [subscriptionData, userData]);

  const handleClearCurrentUserData = useCallback(() => {
    setUserDetails(null);
    setSubscription(null);
  }, []);

  const handleChanges = useCallback(
    ({ eventType, table, new: newPayload }: any) => {
      if (
        eventType === "DELETE" &&
        ["users", "subscriptions"].includes(table)
      ) {
        if (table === "users") {
          setUserDetails(null);
        } else {
          setSubscription(null);
        }
      } else if (
        eventType === "UPDATE" &&
        ["users", "subscriptions"].includes(table)
      ) {
        if (table === "users") {
          setUserDetails(newPayload);
        } else {
          setSubscription(newPayload);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!userDetails) return;

    const events = ["UPDATE", "DELETE"];
    const tables = ["users", "subscriptions"];
    const channel = supabaseClient.channel("user-data");

    events.forEach(event => {
      tables.forEach(table => {
        const filter =
          table === "users"
            ? `id=eq.${userDetails.id}`
            : `user_id=eq.${userDetails.id}`;
        channel.on(
          //@ts-ignore
          "postgres_changes",
          { event, schema: "public", table, filter },
          handleChanges
        );
      });
    });

    channel.subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [handleChanges, userDetails]);

  const value = useMemo(
    () => ({
      session,
      userDetails,
      setUserDetails,
      subscription,
      setSubscription,
      handleClearCurrentUserData,
    }),
    [handleClearCurrentUserData, session, subscription, userDetails]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

// Custom hook for using the context
export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error(
      `useCurrentUser must be used within a CurrentUserContextProvider.`
    );
  }
  return context;
};
