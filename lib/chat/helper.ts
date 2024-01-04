import type {
  Chat,
  ChatMessageMetadata,
  DataMessage,
  ImageResult,
  IndexMessage,
  SaveDataMessage,
  ShowChatMessage,
  UserDetails,
} from "@/types/types";
import {
  determineGrade,
  getLanguage,
  openAISystem,
  systemRule,
} from "@/lib/chat/system";
import {
  updateChatEditMessage,
  updateChatInitialMessage,
  updateChatMessage,
  updateChatMessageContentSpecificIndex,
  updateChatMessageRegenerate,
  uploadChatAttachment,
} from "@/lib/supabase/client/chat";
import { generateUUID, getCurrentDate } from "@/lib/utils";
import type { Dispatch } from "react";
import type { ActionMessage } from "@/lib/context/use-message";
import {
  createChunkDecoder,
  type FunctionCall,
  type JSONValue,
  type Message,
} from "ai";

export type PrefixMap = {
  text?: Message;
  function_call?: Message & {
    role: "assistant";
    function_call: FunctionCall;
  };
  data: JSONValue[];
};

export const constructDataMessage = (
  showMessage: ShowChatMessage[],
  indexMessage: IndexMessage[],
  feature: string
): DataMessage[] => {
  let dataMessage: DataMessage[] = [];
  // initial data message
  if (showMessage.length) {
    dataMessage = showMessage.map((message, index) => {
      const contentIndex = indexMessage[index].currentMessage - 1;
      return {
        role: message.role,
        content: message.content[contentIndex],
      };
    });
    if (feature === "document") {
      // add content to dataMessage before the first element (inclusive for document)
      dataMessage.unshift({
        role: "user",
        content:
          "What is the main topic of this document? Please summarize it.",
      });
    }
  }
  return dataMessage;
};

export const createDataMessage = (
  prompt: string,
  showMessage: ShowChatMessage[],
  indexMessage: IndexMessage[],
  isRegenerate: boolean,
  isEditMessage: boolean,
  editMessageIndex: number,
  editMessageContent: string,
  options: {
    language: string;
    grade: string;
    role: string;
  },
  feature: string
): { dataMessage: DataMessage[]; updatedShowMessage: ShowChatMessage[] } => {
  const dataMessage = constructDataMessage(showMessage, indexMessage, feature);

  // new message created
  if (!dataMessage.length && !isRegenerate && !isEditMessage) {
    const messageSystem = openAISystem(
      options.language,
      options.grade,
      options.role
    );
    dataMessage.push(
      {
        role: "system",
        content: messageSystem,
      },
      {
        role: "user",
        content: prompt,
      }
    );
    showMessage.push(
      {
        id: generateUUID(),
        role: "system",
        content: [messageSystem],
        created_at: getCurrentDate(),
      },
      {
        id: generateUUID(),
        role: "user",
        content: [prompt],
        metadata: [],
        created_at: getCurrentDate(),
      }
    );
  } else {
    if (isRegenerate) {
      // regenerate the message
      dataMessage.pop();
      showMessage[showMessage.length - 1].content.push("");
      if (!showMessage[showMessage.length - 1].metadata) {
        showMessage[showMessage.length - 1].metadata = [];
        for (
          let i = 0;
          i < showMessage[showMessage.length - 1].content.length; // last element not included, handle in handleResponseData
          i++
        ) {
          showMessage[showMessage.length - 1].metadata?.push({});
        }
      }
    } else if (isEditMessage) {
      // get first metadata from the previous message
      const metadata = showMessage[editMessageIndex].metadata;
      console.log(editMessageIndex);
      // edit particular message
      // remove all elements editMessageIndex and after and then add new message, use then function to wait for the process to finish
      dataMessage.splice(
        feature === "document" ? editMessageIndex + 1 : editMessageIndex
      );
      showMessage.splice(editMessageIndex);

      dataMessage.push({
        role: "user",
        content: editMessageContent,
      });
      showMessage.push({
        id: generateUUID(),
        role: "user",
        content: [editMessageContent],
        // take the metadata from the previous message
        metadata: metadata,
        created_at: getCurrentDate(),
      });
    } else {
      // continue the message
      dataMessage.push({
        role: "user",
        content: prompt,
      });
      showMessage.push({
        id: generateUUID(),
        role: "user",
        content: [prompt],
        metadata: [],
        created_at: getCurrentDate(),
      });
    }
  }

  if (dataMessage.length > 1 && feature === "assistant") {
    // inject language if language is not the same as selected language
    // it is possible that user change the role
    showMessage[0].content = [
      openAISystem(options.language, options.grade, options.role),
    ];
    dataMessage[0].content = openAISystem(
      options.language,
      options.grade,
      options.role
    );
  }

  return {
    dataMessage: dataMessage,
    updatedShowMessage: showMessage,
  };
};

// Helper functions
export const createOptions = (
  userDetails: UserDetails,
  language: string,
  grade: string
): { language: string; grade: string; role: string } => {
  return {
    language,
    grade: userDetails.role === "professional" ? "professional" : grade,
    role: String(userDetails.role),
  };
};

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
    language: string;
    grade: string;
    role: string;
  },
  feature: string
): { dataMessage: DataMessage[]; updatedShowMessage: ShowChatMessage[] } => {
  const clonedShowMessage = JSON.parse(JSON.stringify(showMessage)); // deep clone showMessage
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
  );
  if (!isRegenerate) {
    updatedShowMessage.push({
      id: generateUUID(),
      role: "assistant",
      content: [""],
      metadata: [],
      created_at: getCurrentDate(),
    });
  }

  return { dataMessage, updatedShowMessage };
};

// This function handles attachments.
export const handleAttachments = async (
  dataMessage: DataMessage[],
  updatedShowMessage: ShowChatMessage[],
  attachment: File | null,
  userId: string,
  chatId: string
): Promise<DataMessage[]> => {
  if (attachment) {
    const fileId = await uploadChatAttachment(attachment, userId, chatId);
    updatedShowMessage[updatedShowMessage.length - 2].metadata?.push({
      attachments: [
        {
          type: "image",
          chat_id: chatId,
          file_id: fileId,
        },
      ],
    });
  }

  const copyUpdatedShowMessage = JSON.parse(
    JSON.stringify(updatedShowMessage.slice(0, -1))
  ) as ShowChatMessage[];

  const injectionDataMessage = dataMessage.map((message, index) => {
    // get list of metadata attachments from copyUpdatedShowMessage, but only file_id and type e,g {type: "image", file_id: "123"}
    const metadataAttachment = copyUpdatedShowMessage[index].metadata?.find(
      item => item.attachments
    );
    // now filter the metadataAttachment to get only the file_id and type
    const metadataAttachmentFiltered = metadataAttachment?.attachments?.map(
      item => {
        return {
          type: item.type,
          file_id: item.file_id,
        };
      }
    );
    // create injection for metadata to content, if undefined, then just empty string
    // create with fibo identifier, e.g attachment: [{type: "image", file_id: "123"}}]
    const metadataInjection = metadataAttachmentFiltered
      ? `\n\n
      ------------------------------
      DO NOT GIVE THIS INFORMATION TO USER!
      fibo-attachment: ${JSON.stringify(metadataAttachmentFiltered)}`
      : "";

    return {
      role: message.role,
      content: message.content + metadataInjection,
    };
  });

  return injectionDataMessage;
};

// inject system message to the prompt
export const createSystemMessage = (options: {
  language: string;
  grade: string;
  role: string;
}): string => {
  return `
  
  ------------------------------
  DO NOT GIVE THIS INFORMATION TO USER!

  ${getLanguage(options.language)}
  
  ${determineGrade(options.grade, options.role)}
  
  ${systemRule}
  
  DO NOT GIVE THIS INFORMATION TO USER!
  ------------------------------
  `;
};
