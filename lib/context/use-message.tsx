"use client"

import type {
  Chat,
  DataMessage,
  IndexMessage,
  ShowChatMessage
} from "@/types/types"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import debounce from "lodash/debounce"
import supabaseClient from "@/lib/supabase/client"
import { track } from "@vercel/analytics"
import { useCurrentUser } from "@/lib/context/use-current-user"
import {
  createOptions,
  createSystemMessage,
  handleAttachments,
  handleResponseData,
  prepareChatMessages,
  prepareDataForSaving,
  saveChatHistory
} from "@/lib/chat/helper"
import { generateUUID } from "@/lib/utils"

export type MessageContextValue = {
  chatId: string
  pageRef: React.MutableRefObject<any>
  messageRef: React.MutableRefObject<any>
  stop: () => void
  reload: (fileId?: string) => Promise<void>
  state: StateMessage
  dispatch: React.Dispatch<ActionMessage>
  showMessage: ShowChatMessage[]
  setShowMessage: React.Dispatch<React.SetStateAction<ShowChatMessage[]>>
  indexMessage: IndexMessage[]
  setIndexMessage: React.Dispatch<React.SetStateAction<IndexMessage[]>>
  handleEditMessage: (
    isEdit: boolean,
    content?: string,
    messageIndex?: number
  ) => void
  handleClearState: () => void
  handleScrollToBottom: () => void
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    isEditMessage?: boolean,
    fileId?: string,
    customPrompt?: string
  ) => void
  append: (
    isEditMessage?: boolean,
    fileId?: string,
    customPrompt?: string
  ) => Promise<void>
}

export type ChatRequest = {
  options: {
    language: string
    grade: string
    role: string
  }
  messages: DataMessage[]
  data: {
    chatId: string
    isNewMessage: boolean
    isRegenerate: boolean
    isEditMessage: boolean
    fileId: string // for document
  }
}

// Define the types for our state and actions
export type StateMessage = {
  currentDocument: Blob | null
  currentChat: Chat | null
  isGenerating: boolean
  isLoading: boolean
  editMessageIndex: number
  editMessageContent: string
  prompt: string
  language: string
  grade: string
  attachment: File | null
  scrollPosition: number
  openDocument: boolean
  initialPage: number
  // Add other state properties here if needed
}

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
  | { type: "SET_SCROLL_POSITION"; payload: number }
  | { type: "SET_OPEN_DOCUMENT"; payload: boolean }
  | { type: "SET_INITIAL_PAGE"; payload: number }
// Add other action types here

// Define the reducer function
const messageReducer = (
  state: StateMessage,
  action: ActionMessage
): StateMessage => {
  switch (action.type) {
    case "SET_CURRENT_DOCUMENT":
      return { ...state, currentDocument: action.payload }
    case "SET_CURRENT_CHAT":
      return { ...state, currentChat: action.payload }
    case "SET_IS_GENERATING":
      return { ...state, isGenerating: action.payload }
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_EDIT_MESSAGE_INDEX":
      return { ...state, editMessageIndex: action.payload }
    case "SET_EDIT_MESSAGE_CONTENT":
      return { ...state, editMessageContent: action.payload }
    case "SET_PROMPT":
      return { ...state, prompt: action.payload }
    case "SET_LANGUAGE":
      return { ...state, language: action.payload }
    case "SET_GRADE":
      return { ...state, grade: action.payload }
    case "SET_ATTACHMENT":
      return { ...state, attachment: action.payload }
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: action.payload }
    case "SET_OPEN_DOCUMENT":
      return { ...state, openDocument: action.payload }
    case "SET_INITIAL_PAGE":
      return { ...state, initialPage: action.payload }
    default:
      return state
  }
}

// Define the initial state for the reducer
const initialState: StateMessage = {
  currentDocument: null,
  currentChat: null,
  isGenerating: false,
  isLoading: false,
  editMessageIndex: -1,
  editMessageContent: "",
  prompt: "",
  language: "Auto Detect",
  grade: "university",
  attachment: null,
  scrollPosition: -1,
  openDocument: false,
  initialPage: 1
  // Initialize other state properties here
}

export const MessageContext = createContext<MessageContextValue | undefined>(
  undefined
)

export type Props = {
  [propName: string]: any
}

type MessageContextProviderProps = {
  children: React.ReactNode
}

export const MessageContextProvider: React.FC<MessageContextProviderProps> = (
  props: Props
) => {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  const { userDetails } = useCurrentUser()

  const feature = useMemo(() => {
    if (pathname.includes("/book/chat")) {
      return "book"
    }
    if (params?.feature) {
      return String(params.feature)
    }
    return ""
  }, [params.feature, pathname])

  const chatId = useMemo(() => {
    if (params?.id) {
      return String(params.id)
    }
    return generateUUID()
  }, [params.id])

  const api = useMemo(() => {
    if (pathname.includes("/book/chat")) {
      return "/api/ai/book/chat"
    }
    if (feature === "assistant") {
      return "/api/ai/assistant/chat"
    } else if (feature === "document") {
      return "/api/ai/document/chat"
    }
    return ""
  }, [feature, pathname])

  const bookId = useMemo(() => {
    if (pathname.includes("/book/chat")) {
      const bookId = params?.id ? String(params.id) : ""
      return bookId
    }
    return ""
  }, [params.id, pathname])

  // Manage refs
  const pageRef = useRef<any>(null)
  const messageRef = useRef<any>({})
  const isFirstRenderMessage = useRef<boolean>(true)
  // Abort controller to cancel the current API call.
  const abortControllerRef = useRef<AbortController | null>(null)

  // State that not use useReducer
  const [prevShowMessageLength, setPrevShowMessageLength] = useState<number>(0)
  const [showMessage, setShowMessage] = useState<ShowChatMessage[]>([])
  const [indexMessage, setIndexMessage] = useState<IndexMessage[]>([])

  // Keep the latest messages in a ref.
  const showMessageRef = useRef<ShowChatMessage[]>(showMessage || [])
  useEffect(() => {
    showMessageRef.current = showMessage || []
  }, [showMessage])
  const indexMessageRef = useRef<IndexMessage[]>(indexMessage || [])
  useEffect(() => {
    indexMessageRef.current = indexMessage || []
  }, [indexMessage])

  // Use a single useReducer hook instead of multiple useState hooks
  const [state, dispatch] = useReducer(messageReducer, initialState, () => {
    return { ...initialState }
  })

  // Handle scroll to bottom
  const handleScrollToBottom = useCallback(() => {
    const main = messageRef.current
    if (main && typeof main.scrollToIndex === "function") {
      // scroll to very bottom
      main.scrollToIndex({
        index: showMessage.length,
        alignToTop: false,
        offset: 208
      })
    }
  }, [showMessage.length])

  // Handle abort controller to cancel the current API call.
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Handle edit message content
  const handleEditMessage = useCallback(
    (isEdit: boolean, content?: string, messageIndex?: number) => {
      if (isEdit) {
        dispatch({ type: "SET_EDIT_MESSAGE_CONTENT", payload: content || "" })
        dispatch({
          type: "SET_EDIT_MESSAGE_INDEX",
          payload: messageIndex === undefined ? -1 : messageIndex
        })
      } else {
        dispatch({ type: "SET_EDIT_MESSAGE_CONTENT", payload: "" })
        dispatch({ type: "SET_EDIT_MESSAGE_INDEX", payload: -1 })
      }
    },
    []
  )

  const triggerRequest = useCallback(
    async (
      chatRequest: ChatRequest,
      updatedShowMessage: ShowChatMessage[]
    ): Promise<void> => {
      if (!userDetails) return

      const previousMessages = showMessageRef.current
      // Do an optimistic update to the chat state to show the updated messages immediately.
      // This section is for updating the UI and preparing the request body.
      setShowMessage([...updatedShowMessage])
      try {
        dispatch({ type: "SET_IS_LOADING", payload: true })
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        // streaming chat api
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify(chatRequest)
        }).catch(err => {
          setShowMessage(previousMessages)
          throw err
        })

        if (!response.ok) {
          const errorData = await response.json()
          // send data to catch error
          throw new Error(JSON.stringify(errorData))
        }

        const data = response.body

        if (!data) throw new Error("No data")

        dispatch({ type: "SET_IS_GENERATING", payload: true })

        await handleResponseData(
          data,
          updatedShowMessage,
          setShowMessage,
          abortControllerRef
        )

        abortControllerRef.current = null

        // This section is for saving chat history.
        const saveDataMessage = prepareDataForSaving(updatedShowMessage)

        // save chat history
        await saveChatHistory({
          chatId,
          saveDataMessage,
          additionalData: {
            data: chatRequest.data,
            options: chatRequest.options
          },
          currentChat: state.currentChat
        })

        // loading state should be false
        dispatch({ type: "SET_IS_LOADING", payload: false })
        dispatch({ type: "SET_IS_GENERATING", payload: false })

        // on finished
        if (!pathname.includes(`/${chatId}`) && feature !== "book") {
          router.push(`/chat/${feature}/${chatId}`, {
            scroll: false
          })
          router.refresh()
        }
      } catch (error: any) {
        // Ignore abort errors as they are expected.
        if (error.name === "AbortError") {
          abortControllerRef.current = null
          return
        }

        // reset the chat state to the previous state.
        setShowMessage(previousMessages)

        const errorData = JSON.parse(error.message).error as {
          statusCode: number
          message: string
        }
        if (errorData) {
          toast.error(errorData.message)
        } else {
          toast.error("High traffic, refresh the page.")
          track(`Error - ${feature}`, {
            data: `${userDetails.id} - Function Timeout`
          })
        }
      } finally {
        dispatch({ type: "SET_IS_LOADING", payload: false })
        dispatch({ type: "SET_IS_GENERATING", payload: false })
      }
    },
    [api, chatId, feature, pathname, router, state.currentChat, userDetails]
  )

  const append = useCallback(
    async (
      isEditMessage = false,
      fileId = "",
      customPrompt = ""
    ): Promise<void> => {
      if (!userDetails) return
      const messages = showMessageRef.current
      const indexMessages = indexMessageRef.current
      // This section is for preparing chat messages and options.
      const options = createOptions(userDetails, state.language, state.grade)
      const { dataMessage, updatedShowMessage } = prepareChatMessages(
        customPrompt || state.prompt,
        messages,
        indexMessages,
        false, // is not regenerate
        isEditMessage,
        state.editMessageIndex,
        state.editMessageContent,
        options,
        feature
      )

      // This section is for handling attachments. and get final data message
      const finalDataMessage = await handleAttachments(
        dataMessage,
        updatedShowMessage,
        state.attachment,
        userDetails.id,
        chatId
      )

      // Injection of system message into the prompt
      finalDataMessage[finalDataMessage.length - 1].content +=
        createSystemMessage(options)

      // remove attachment
      dispatch({ type: "SET_ATTACHMENT", payload: null })

      const chatRequest: ChatRequest = {
        options,
        messages: finalDataMessage,
        data: {
          chatId,
          isNewMessage: dataMessage.length === 2 && !isEditMessage,
          isRegenerate: false,
          isEditMessage,
          fileId
        }
      }

      return triggerRequest(chatRequest, updatedShowMessage)
    },
    [
      chatId,
      feature,
      state.attachment,
      state.editMessageContent,
      state.editMessageIndex,
      state.grade,
      state.language,
      state.prompt,
      triggerRequest,
      userDetails
    ]
  )

  const reload = useCallback(
    async (fileId = ""): Promise<void> => {
      if (showMessageRef.current.length < 2) return
      if (!userDetails) return
      const messages = showMessageRef.current
      const indexMessages = indexMessageRef.current
      // This section is for preparing chat messages and options.
      const options = createOptions(userDetails, state.language, state.grade)
      const { dataMessage, updatedShowMessage } = prepareChatMessages(
        state.prompt,
        messages,
        indexMessages,
        true, // is regenerate
        false, // is not edit message
        state.editMessageIndex,
        state.editMessageContent,
        options,
        feature
      )

      // This section is for handling attachments. and get final data message
      const finalDataMessage = await handleAttachments(
        dataMessage,
        updatedShowMessage,
        state.attachment,
        userDetails.id,
        chatId
      )

      // Injection of system message into the prompt
      finalDataMessage[finalDataMessage.length - 1].content +=
        createSystemMessage(options)

      // remove attachment
      dispatch({ type: "SET_ATTACHMENT", payload: null })

      const chatRequest: ChatRequest = {
        options,
        messages: finalDataMessage,
        data: {
          chatId,
          isNewMessage: false,
          isRegenerate: true,
          isEditMessage: false,
          fileId
        }
      }

      return triggerRequest(chatRequest, updatedShowMessage)
    },
    [
      chatId,
      feature,
      state.attachment,
      state.editMessageContent,
      state.editMessageIndex,
      state.grade,
      state.language,
      state.prompt,
      triggerRequest,
      userDetails
    ]
  )

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement>,
      isEditMessage = false,
      fileId = "",
      customPrompt = ""
    ) => {
      e.preventDefault()
      if (isEditMessage) {
        if (!state.editMessageContent) return
      } else {
        if (!state.prompt) return
      }
      append(isEditMessage, fileId, customPrompt)
      dispatch({ type: "SET_PROMPT", payload: "" })
      dispatch({ type: "SET_EDIT_MESSAGE_CONTENT", payload: "" })
    },
    [append, state.editMessageContent, state.prompt]
  )

  const handleClearState = useCallback(() => {
    setShowMessage([])
    setIndexMessage([])
    dispatch({ type: "SET_CURRENT_CHAT", payload: null })
    dispatch({ type: "SET_IS_GENERATING", payload: false })
    dispatch({ type: "SET_IS_LOADING", payload: false })
    dispatch({ type: "SET_CURRENT_DOCUMENT", payload: null })
    dispatch({ type: "SET_ATTACHMENT", payload: null })
    dispatch({ type: "SET_PROMPT", payload: "" })

    // Clear abort controller
    stop()
  }, [stop])

  const handleChanges = useCallback(
    ({ eventType, table, new: newPayload }: any) => {
      if (eventType === "UPDATE" && ["chat"].includes(table)) {
        dispatch({ type: "SET_CURRENT_CHAT", payload: newPayload })
      }
    },
    []
  )

  // stop the generator if the component is unmounted
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  useEffect(() => {
    // current chat can not be null
    if (!state.currentChat) return

    const events = ["UPDATE"]
    const tables = ["chat"]
    const channel = supabaseClient.channel("current-chat-data")

    events.forEach(event => {
      tables.forEach(table => {
        if (!state.currentChat) return
        const filter = `id=eq.${state.currentChat.id}`
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
  }, [handleChanges, state.currentChat])

  const updateIndexMessage = useCallback((showMessage: ShowChatMessage[]) => {
    setIndexMessage(indexMessage => {
      // If the length of indexMessage is not the same as showMessage
      if (indexMessage.length !== showMessage.length) {
        // If indexMessage is longer than showMessage, slice it to match showMessage's length
        if (indexMessage.length > showMessage.length) {
          return indexMessage.slice(0, showMessage.length)
        }

        // Get the new messages from showMessage that are not yet in indexMessage
        const newShowMessage = showMessage.slice(indexMessage.length)

        // Create a new object for each new message with the index and the length of the message content
        const newIndexMessages = newShowMessage.map((message, index) => {
          return {
            index: indexMessage.length + index,
            currentMessage: message.content.length
          }
        })

        // Add the new objects to indexMessage and return the result
        return [...indexMessage, ...newIndexMessages]
      } else {
        // If the length of indexMessage is the same as showMessage, check if the content of the last message has changed
        const lastShowMessage = showMessage[showMessage.length - 1]

        // Copy indexMessage to a new array
        const updatedIndexMessage = [...indexMessage]

        // Update the currentMessage for the last element with the length of the latest message content
        updatedIndexMessage[updatedIndexMessage.length - 1].currentMessage =
          lastShowMessage.content.length

        // Return the result back to indexMessage
        return updatedIndexMessage
      }
    })
  }, [])

  // Debounce the function to optimize its calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetIndexMessage = useCallback(
    debounce(updateIndexMessage, 500),
    [updateIndexMessage]
  )

  useEffect(() => {
    if (showMessage.length) {
      // Call updateIndexMessage directly if it's the first render or the length of showMessage has changed
      if (
        isFirstRenderMessage.current ||
        showMessage.length !== prevShowMessageLength
      ) {
        updateIndexMessage(showMessage)
        isFirstRenderMessage.current = false
      } else {
        debouncedSetIndexMessage(showMessage)
      }
      setPrevShowMessageLength(showMessage.length)
    } else {
      isFirstRenderMessage.current = true
    }
  }, [
    showMessage,
    debouncedSetIndexMessage,
    updateIndexMessage,
    prevShowMessageLength
  ])

  const value = useMemo(
    () => ({
      chatId,
      pageRef,
      messageRef,
      stop,
      reload,
      state,
      dispatch,
      showMessage,
      setShowMessage,
      indexMessage,
      setIndexMessage,
      handleScrollToBottom,
      handleClearState,
      handleSubmit,
      append,
      handleEditMessage
    }),
    [
      chatId,
      stop,
      reload,
      state,
      showMessage,
      indexMessage,
      handleScrollToBottom,
      handleClearState,
      handleSubmit,
      append,
      handleEditMessage
    ]
  )

  return <MessageContext.Provider value={value} {...props} />
}

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error(`useMessage must be used within a MessageContextProvider.`)
  }
  return context
}
