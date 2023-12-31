import type { ChatMessageMetadata } from "@/types/types";
import ChatMetadataImage from "@/components/chat/metadata/image";
import ChatMetadataAttachment from "@/components/chat/metadata/attachment";

type Props = {
  metadata: ChatMessageMetadata[];
  contentIndex: number;
};

export default function ChatMetadata({ metadata, contentIndex }: Props) {
  const currentMetadata = metadata[contentIndex];

  if (!currentMetadata) return null;

  // Check if currentMetadata is an empty object or fibo document
  if (
    !Object.keys(currentMetadata).length ||
    currentMetadata.source_documents
  ) {
    return null;
  }

  // Check if the metadata is empty, e.g [{}]
  if (metadata.length === 1 && !Object.keys(metadata[0]).length) {
    return null;
  }

  const {
    academic_search: academic,
    google_search: google,
    youtube_search: youtube,
    attachments: attachments,
    image_result: imageResults,
  } = currentMetadata;

  if (attachments) {
    return (
      <div className="flex flex-col gap-4 pb-5">
        <ChatMetadataAttachment metadata={attachments} />
      </div>
    );
  }

  if (imageResults) {
    return (
      <div className="flex flex-col gap-4 pb-5">
        <ChatMetadataImage metadata={imageResults} />
      </div>
    );
  }

  return <div className="flex flex-col gap-4 pb-5"></div>;
}
