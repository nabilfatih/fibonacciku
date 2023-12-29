"use client";

import type { Chat, IndexMessage, ShowChatMessage } from "@/types/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useCurrentUser } from "@/lib/context/use-current-user";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import supabaseClient from "@/lib/supabase/client";
import { track } from "@vercel/analytics";

type MessageContextValue = {
  pageRef: React.MutableRefObject<any>;
  messageRef: React.MutableRefObject<any>;
  stopGenerating: React.MutableRefObject<boolean>;
  state: StateMessage;
  dispatch: React.Dispatch<ActionMessage>;
  showMessage: ShowChatMessage[];
  setShowMessage: React.Dispatch<React.SetStateAction<ShowChatMessage[]>>;
  indexMessage: IndexMessage[];
  setIndexMessage: React.Dispatch<React.SetStateAction<IndexMessage[]>>;
  handleEditMessage: (
    isEdit: boolean,
    content?: string,
    messageIndex?: number
  ) => void;
  handleClearState: () => void;
  handleScrollToBottom: () => void;
  handleSubmitChat: () => Promise<void>;
  handleSubmitDocument: () => Promise<void>;
  handleSubmitBookChat: () => Promise<void>;
};

// Define the types for our state and actions
export type StateMessage = {
  currentDocument: Blob | null;
  currentChat: Chat | null;
  isGenerating: boolean;
  isLoading: boolean;
  editMessageIndex: number;
  editMessageContent: string;
  prompt: string;
  language: string;
  grade: string;
  attachment: File | null;
  scrollPosition: number;
  // Add other state properties here if needed
};

export type ActionMessage =
  | { type: "SET_CURRENT_DOCUMENT"; payload: Blob | null }
  | { type: "SET_CURRENT_CHAT"; payload: Chat | null }
  | { type: "SET_IS_GENERATING"; payload: boolean }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_EDIT_MESSAGE_INDEX"; payload: number }
  | { type: "SET_EDIT_MESSAGE_CONTENT"; payload: string }
  | { type: "SET_PROMPT"; payload: string }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_GRADE"; payload: string }
  | { type: "SET_ATTACHMENT"; payload: File | null }
  | { type: "SET_SCROLL_POSITION"; payload: number };
// Add other action types here

// Define the reducer function
const messageReducer = (
  state: StateMessage,
  action: ActionMessage
): StateMessage => {
  switch (action.type) {
    case "SET_CURRENT_DOCUMENT":
      return { ...state, currentDocument: action.payload };
    case "SET_CURRENT_CHAT":
      return { ...state, currentChat: action.payload };
    case "SET_IS_GENERATING":
      return { ...state, isGenerating: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_EDIT_MESSAGE_INDEX":
      return { ...state, editMessageIndex: action.payload };
    case "SET_EDIT_MESSAGE_CONTENT":
      return { ...state, editMessageContent: action.payload };
    case "SET_PROMPT":
      return { ...state, prompt: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_GRADE":
      return { ...state, grade: action.payload };
    case "SET_ATTACHMENT":
      return { ...state, attachment: action.payload };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: action.payload };
    default:
      return state;
  }
};

// Define the initial state for the reducer
const initialState: StateMessage = {
  currentDocument: null,
  currentChat: null,
  isGenerating: false,
  isLoading: false,
  editMessageIndex: -1,
  editMessageContent: "",
  prompt: "",
  language: "auto detect",
  grade: "university",
  attachment: null,
  scrollPosition: -1,
  // Initialize other state properties here
};

export const MessageContext = createContext<MessageContextValue | undefined>(
  undefined
);

export type Props = {
  [propName: string]: any;
};

type MessageContextProviderProps = {
  children: React.ReactNode;
};

export const MessageContextProvider: React.FC<MessageContextProviderProps> = (
  props: Props
) => {
  const params = useParams();
  const pathname = usePathname();

  const feature = String(params.feature);
  const chatId = params?.id ? String(params.id) : "";
  const bookId = useMemo(() => {
    if (pathname.includes("/book/chat")) {
      const bookId = params?.id ? String(params.id) : "";
      return bookId;
    }
    return "";
  }, [params.id, pathname]);

  const { userDetails } = useCurrentUser();

  // Manage refs
  const pageRef = useRef<any>(null);
  const messageRef = useRef<any>({});
  const stopGenerating = useRef<boolean>(false);
  const isFirstRenderMessage = useRef<boolean>(true);

  // State that not use useReducer
  const [prevShowMessageLength, setPrevShowMessageLength] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<ShowChatMessage[]>([]);
  const [indexMessage, setIndexMessage] = useState<IndexMessage[]>([]);

  // Use a single useReducer hook instead of multiple useState hooks
  const [state, dispatch] = useReducer(messageReducer, initialState, () => {
    return { ...initialState };
  });

  const handleScrollToBottom = useCallback(() => {
    const main = messageRef.current;
    if (main && typeof main.scrollToIndex === "function") {
      // scroll to very bottom
      main.scrollToIndex({
        index: showMessage.length,
        alignToTop: false,
        offset: 208,
      });
    }
  }, [showMessage.length]);

  const handleEditMessage = useCallback(
    (isEdit: boolean, content?: string, messageIndex?: number) => {
      if (isEdit) {
        dispatch({ type: "SET_EDIT_MESSAGE_CONTENT", payload: content || "" });
        dispatch({
          type: "SET_EDIT_MESSAGE_INDEX",
          payload: messageIndex === undefined ? -1 : messageIndex,
        });
      } else {
        dispatch({ type: "SET_EDIT_MESSAGE_CONTENT", payload: "" });
        dispatch({ type: "SET_EDIT_MESSAGE_INDEX", payload: -1 });
      }
    },
    []
  );

  const handleSubmitChat = useCallback(async () => {}, []);

  const handleSubmitDocument = useCallback(async () => {}, []);

  const handleSubmitBookChat = useCallback(async () => {}, []);

  const handleClearState = useCallback(() => {
    setShowMessage([]);
    setIndexMessage([]);
    dispatch({ type: "SET_CURRENT_CHAT", payload: null });
    dispatch({ type: "SET_IS_GENERATING", payload: false });
    dispatch({ type: "SET_IS_LOADING", payload: false });
    dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null });
    dispatch({ type: "SET_ATTACHMENT", payload: null });
    stopGenerating.current = false;
  }, []);

  const handleChanges = useCallback(
    ({ eventType, table, new: newPayload }: any) => {
      if (eventType === "UPDATE" && ["chat"].includes(table)) {
        dispatch({ type: "SET_CURRENT_CHAT", payload: newPayload });
      }
    },
    []
  );

  useEffect(() => {
    // current chat can not be null
    if (!state.currentChat) return;

    const events = ["UPDATE"];
    const tables = ["chat"];
    const channel = supabaseClient.channel("current-chat-data");

    events.forEach((event) => {
      tables.forEach((table) => {
        if (!state.currentChat) return;
        const filter = `id=eq.${state.currentChat.id}`;
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
  }, [handleChanges, state.currentChat]);

  const updateIndexMessage = useCallback((showMessage: ShowChatMessage[]) => {
    setIndexMessage((indexMessage) => {
      // If the length of indexMessage is not the same as showMessage
      if (indexMessage.length !== showMessage.length) {
        // If indexMessage is longer than showMessage, slice it to match showMessage's length
        if (indexMessage.length > showMessage.length) {
          return indexMessage.slice(0, showMessage.length);
        }

        // Get the new messages from showMessage that are not yet in indexMessage
        const newShowMessage = showMessage.slice(indexMessage.length);

        // Create a new object for each new message with the index and the length of the message content
        const newIndexMessages = newShowMessage.map((message, index) => {
          return {
            index: indexMessage.length + index,
            currentMessage: message.content.length,
          };
        });

        // Add the new objects to indexMessage and return the result
        return [...indexMessage, ...newIndexMessages];
      } else {
        // If the length of indexMessage is the same as showMessage, check if the content of the last message has changed
        const lastShowMessage = showMessage[showMessage.length - 1];

        // Copy indexMessage to a new array
        const updatedIndexMessage = [...indexMessage];

        // Update the currentMessage for the last element with the length of the latest message content
        updatedIndexMessage[updatedIndexMessage.length - 1].currentMessage =
          lastShowMessage.content.length;

        // Return the result back to indexMessage
        return updatedIndexMessage;
      }
    });
  }, []);

  // Debounce the function to optimize its calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetIndexMessage = useCallback(
    debounce(updateIndexMessage, 500),
    [updateIndexMessage]
  );

  useEffect(() => {
    if (showMessage.length) {
      // Call updateIndexMessage directly if it's the first render or the length of showMessage has changed
      if (
        isFirstRenderMessage.current ||
        showMessage.length !== prevShowMessageLength
      ) {
        updateIndexMessage(showMessage);
        isFirstRenderMessage.current = false;
      } else {
        debouncedSetIndexMessage(showMessage);
      }
      setPrevShowMessageLength(showMessage.length);
    } else {
      isFirstRenderMessage.current = true;
    }
  }, [
    showMessage,
    debouncedSetIndexMessage,
    updateIndexMessage,
    prevShowMessageLength,
  ]);

  const value = useMemo(
    () => ({
      pageRef,
      messageRef,
      stopGenerating,
      state,
      dispatch,
      showMessage,
      setShowMessage,
      indexMessage,
      setIndexMessage,
      handleScrollToBottom,
      handleClearState,
      handleSubmitChat,
      handleSubmitDocument,
      handleSubmitBookChat,
      handleEditMessage,
    }),
    [
      state,
      showMessage,
      indexMessage,
      handleScrollToBottom,
      handleClearState,
      handleSubmitChat,
      handleSubmitDocument,
      handleSubmitBookChat,
      handleEditMessage,
    ]
  );

  return <MessageContext.Provider value={value} {...props} />;
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error(`useMessage must be used within a MessageContextProvider.`);
  }
  return context;
};
