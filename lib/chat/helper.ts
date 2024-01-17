import { type JSONValue } from "ai"

import type {
  Chat,
  ChatMessageMetadata,
  DataMessage,
  ImageResult,
  IndexMessage,
  SaveDataMessage,
  ShowChatMessage,
  SourceDocument,
  UserDetails
} from "@/types/types"
import { readDataStream } from "@/lib/chat/read-data-stream"
import {
  determineGrade,
  getLanguage,
  openAISystem,
  systemRule
} from "@/lib/chat/system"
import type { ChatRequest } from "@/lib/context/use-message"
import {
  updateChatMessage,
  updateChatMessageContentSpecificIndex,
  uploadChatAttachment
} from "@/lib/supabase/client/chat"
import { generateUUID, getCurrentDate } from "@/lib/utils"

export type PrefixMap = {
  data: JSONValue[]
}

export type SaveChatHistoryType = {
  chatId: string
  saveDataMessage: SaveDataMessage[]
  additionalData: Pick<ChatRequest, "data" | "options">
  currentChat: Chat | null
}

export const constructDataMessage = (
  showMessage: ShowChatMessage[],
  indexMessage: IndexMessage[]
): DataMessage[] => {
  let dataMessage: DataMessage[] = []
  // initial data message
  if (showMessage.length) {
    dataMessage = showMessage.map((message, index) => {
      const contentIndex = indexMessage[index].currentMessage - 1
      return {
        role: message.role,
        content: message.content[contentIndex]
      }
    })
  }
  return dataMessage
}

export const createDataMessage = (
  prompt: string,
  showMessage: ShowChatMessage[],
  indexMessage: IndexMessage[],
  isRegenerate: boolean,
  isEditMessage: boolean,
  editMessageIndex: number,
  editMessageContent: string,
  options: {
    language: string
    grade: string
    role: string
  },
  feature: string
): { dataMessage: DataMessage[]; updatedShowMessage: ShowChatMessage[] } => {
  const dataMessage = constructDataMessage(showMessage, indexMessage)

  // new message created
  if (!dataMessage.length && !isRegenerate && !isEditMessage) {
    const messageSystem = openAISystem(
      options.language,
      options.grade,
      options.role
    )
    dataMessage.push(
      {
        role: "system",
        content: messageSystem
      },
      {
        role: "user",
        content: prompt
      }
    )
    showMessage.push(
      {
        id: generateUUID(),
        role: "system",
        content: [messageSystem],
        created_at: getCurrentDate()
      },
      {
        id: generateUUID(),
        role: "user",
        content: [prompt],
        metadata: [],
        created_at: getCurrentDate()
      }
    )
  } else {
    if (isRegenerate) {
      // regenerate the message
      dataMessage.pop()
      showMessage[showMessage.length - 1].content.push("")
      if (!showMessage[showMessage.length - 1].metadata) {
        showMessage[showMessage.length - 1].metadata = []
        for (
          let i = 0;
          i < showMessage[showMessage.length - 1].content.length; // last element not included, handle in handleResponseData
          i++
        ) {
          showMessage[showMessage.length - 1].metadata?.push({})
        }
      }
    } else if (isEditMessage) {
      // get first metadata from the previous message
      const metadata = showMessage[editMessageIndex].metadata
      // edit particular message
      // remove all elements editMessageIndex and after and then add new message, use then function to wait for the process to finish
      dataMessage.splice(
        feature === "document" ? editMessageIndex + 1 : editMessageIndex
      )
      showMessage.splice(editMessageIndex)

      dataMessage.push({
        role: "user",
        content: editMessageContent
      })
      showMessage.push({
        id: generateUUID(),
        role: "user",
        content: [editMessageContent],
        // take the metadata from the previous message
        metadata: metadata,
        created_at: getCurrentDate()
      })
    } else {
      // continue the message
      dataMessage.push({
        role: "user",
        content: prompt
      })
      showMessage.push({
        id: generateUUID(),
        role: "user",
        content: [prompt],
        metadata: [],
        created_at: getCurrentDate()
      })
    }
  }

  if (dataMessage.length > 1 && feature === "assistant") {
    // inject language if language is not the same as selected language
    // it is possible that user change the role
    showMessage[0].content = [
      openAISystem(options.language, options.grade, options.role)
    ]
    dataMessage[0].content = openAISystem(
      options.language,
      options.grade,
      options.role
    )
  }

  // changing of architecture of document feature, now has role system
  if (feature === "document") {
    // get the first message
    const firstMessage = dataMessage[0]
    if (firstMessage.role !== "system") {
      // if the first message is not system, then add system message on first index
      dataMessage.unshift({
        role: "system",
        content: openAISystem(options.language, options.grade, options.role)
      })
      showMessage.unshift({
        id: generateUUID(),
        role: "system",
        content: [openAISystem(options.language, options.grade, options.role)],
        created_at: getCurrentDate()
      })
    }
  }

  return {
    dataMessage: dataMessage,
    updatedShowMessage: showMessage
  }
}

// Helper functions
export const createOptions = (
  userDetails: UserDetails,
  language: string,
  grade: string
): { language: string; grade: string; role: string } => {
  return {
    language,
    grade: userDetails.role === "professional" ? "professional" : grade,
    role: String(userDetails.role)
  }
}

// This function prepares chat messages and options.
export const prepareChatMessages = (
  prompt: string,
  showMessage: ShowChatMessage[],
  indexMessage: IndexMessage[],
  isRegenerate: boolean,
  isEditMessage: boolean,
  editMessageIndex: number,
  editMessageContent: string,
  options: {
    language: string
    grade: string
    role: string
  },
  feature: string
): { dataMessage: DataMessage[]; updatedShowMessage: ShowChatMessage[] } => {
  const clonedShowMessage = JSON.parse(JSON.stringify(showMessage)) // deep clone showMessage
  const { dataMessage, updatedShowMessage } = createDataMessage(
    prompt,
    clonedShowMessage,
    indexMessage,
    isRegenerate,
    isEditMessage,
    editMessageIndex,
    editMessageContent,
    options,
    feature
  )
  if (!isRegenerate) {
    updatedShowMessage.push({
      id: generateUUID(),
      role: "assistant",
      content: [""],
      metadata: [],
      created_at: getCurrentDate()
    })
  }

  return { dataMessage, updatedShowMessage }
}

// This function handles attachments.
export const handleAttachments = async (
  dataMessage: DataMessage[],
  updatedShowMessage: ShowChatMessage[],
  attachment: File | null,
  userId: string,
  chatId: string
): Promise<DataMessage[]> => {
  if (attachment) {
    const fileId = await uploadChatAttachment(attachment, userId, chatId)
    updatedShowMessage[updatedShowMessage.length - 2].metadata?.push({
      attachments: [
        {
          type: "image",
          chat_id: chatId,
          file_id: fileId
        }
      ]
    })
  }

  const copyUpdatedShowMessage = JSON.parse(
    JSON.stringify(updatedShowMessage.slice(0, -1))
  ) as ShowChatMessage[]

  const injectionDataMessage = dataMessage.map((message, index) => {
    // get list of metadata attachments from copyUpdatedShowMessage, but only file_id and type e,g {type: "image", file_id: "123"}
    const metadataAttachment = copyUpdatedShowMessage[index]?.metadata?.find(
      item => item.attachments
    )
    // now filter the metadataAttachment to get only the file_id and type
    const metadataAttachmentFiltered = metadataAttachment?.attachments?.map(
      item => {
        return {
          type: item.type,
          file_id: item.file_id
        }
      }
    )
    // create injection for metadata to content, if undefined, then just empty string
    // create with fibo identifier, e.g attachment: [{type: "image", file_id: "123"}}]
    const metadataInjection = metadataAttachmentFiltered
      ? `
    
      ------------------------------
      DO NOT GIVE THIS INFORMATION TO USER!

      fibo-attachment: ${JSON.stringify(metadataAttachmentFiltered)}

      DO NOT GIVE THIS INFORMATION TO USER!
      ------------------------------
      `
      : ""

    return {
      role: message.role,
      content: message.content + metadataInjection
    }
  })

  return injectionDataMessage
}

// inject system message to the prompt
export const createSystemMessage = (options: {
  language: string
  grade: string
  role: string
}): string => {
  return `
  
  ------------------------------
  DO NOT GIVE THIS INFORMATION TO USER!

  ${getLanguage(options.language)}
  
  ${determineGrade(options.grade, options.role)}
  
  DO NOT GIVE THIS INFORMATION TO USER!
  ------------------------------
  `
}

export const handleResponseData = async (
  data: ReadableStream<Uint8Array>,
  updatedShowMessage: ShowChatMessage[],
  setShowMessage: (showMessage: ShowChatMessage[]) => void,
  abortControllerRef: React.MutableRefObject<AbortController | null>
): Promise<void> => {
  const reader = data.getReader()

  const prefixMap: PrefixMap = {
    data: [] as JSONValue[]
  }

  // we create a map of each prefix, and for each prefixed message we push to the map
  for await (const { type, value } of readDataStream(reader, {
    isAborted: () => abortControllerRef.current === null
  })) {
    if (type === "text") {
      updatedShowMessage[updatedShowMessage.length - 1].content[
        updatedShowMessage[updatedShowMessage.length - 1].content.length - 1
      ] += value
      setShowMessage([...updatedShowMessage])
    }

    if (type === "data") {
      prefixMap["data"].push(...value)
      const data = prefixMap["data"]
      const functionData = data as {
        toolName: string
        data: any
      }[]
      const messageMetadata = handleMetadataMessage(functionData)
      // push metadata to the last metadata of the last message in the updatedShowMessage
      updatedShowMessage[updatedShowMessage.length - 1].metadata?.push(
        messageMetadata
      )
      setShowMessage([...updatedShowMessage])
    }
  }

  // if prefixMap.data is empty, just push empty object to last metadata of the last message in the updatedShowMessage
  if (!prefixMap.data.length) {
    updatedShowMessage[updatedShowMessage.length - 1].metadata?.push({})
    setShowMessage([...updatedShowMessage])
  }
}

export const handleMetadataMessage = (
  functionData: {
    toolName: string
    data: any
  }[]
): ChatMessageMetadata => {
  const messageMetadata = {} as ChatMessageMetadata
  // filter out the function that  not get_links_or_videos_or_academic_research
  const listLinksOrVideosOrAcademicResearch = functionData.filter(
    item => item.toolName === "get_links_or_videos_or_academic_research"
  )
  // update the last metadata of the last message in the updatedShowMessage
  if (listLinksOrVideosOrAcademicResearch.length) {
    // get youtubeObject from the list
    const youtubeObject = listLinksOrVideosOrAcademicResearch.find(item =>
      item.data.results.find((item: any) => item.type === "youtube")
    )
    // get googleObject from the list
    const googleObject = listLinksOrVideosOrAcademicResearch.find(item =>
      item.data.results.find((item: any) => item.type === "google")
    )
    // get academicObject from the list
    const academicObject = listLinksOrVideosOrAcademicResearch.find(item =>
      item.data.results.find((item: any) => item.type === "academic")
    )

    if (youtubeObject) {
      messageMetadata.youtube_search = youtubeObject.data.results.find(
        (item: any) => item.type === "youtube"
      ).results
    }
    if (googleObject) {
      messageMetadata.google_search = googleObject.data.results.find(
        (item: any) => item.type === "google"
      ).results
    }
    if (academicObject) {
      messageMetadata.academic_search = academicObject.data.results.find(
        (item: any) => item.type === "academic"
      ).results
    }
  }

  const imageResults = functionData.filter(
    item => item.toolName === "create_image"
  )
  if (imageResults.length) {
    const imageResult = imageResults[0].data.images as ImageResult[]
    if (imageResult) {
      messageMetadata.image_result = imageResult
    }
  }

  const documentResults = functionData.filter(
    item => item.toolName === "get_document"
  )
  if (documentResults.length) {
    const documentResult = documentResults[0].data.sources as SourceDocument[]
    if (documentResult.length) {
      messageMetadata.source_documents = documentResult
    }
  }

  return messageMetadata
}

// This function prepares data for saving.
export const prepareDataForSaving = (
  updatedShowMessage: ShowChatMessage[]
): SaveDataMessage[] => {
  return updatedShowMessage.map(message => {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      metadata: message.metadata,
      created_at: message.created_at
    }
  })
}

// This function saves chat history.
export const saveChatHistory = async ({
  chatId,
  saveDataMessage,
  additionalData,
  currentChat
}: SaveChatHistoryType): Promise<void> => {
  const { options } = additionalData

  const currentId = chatId || currentChat?.id || ""

  // update chat
  await updateChatMessage(currentId, saveDataMessage)

  // Expensive operation, so we only do it at the end of the chat.
  if (!currentChat) return
  let updateNeeded = false
  if (currentChat.language !== options.language) updateNeeded = true
  if (currentChat.grade !== options.grade) updateNeeded = true
  if (updateNeeded) {
    await updateChatMessageContentSpecificIndex(
      currentId,
      0,
      0,
      openAISystem(options.language, options.grade, options.role),
      {
        language: options.language,
        grade: options.grade
      }
    )
  }
}
