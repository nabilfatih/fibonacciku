import type { ChatMessageMetadata } from "@/types/types"

import ChatMetadataAcademic from "@/components/chat/metadata/academic"
import ChatMetadataAttachment from "@/components/chat/metadata/attachment"
import ChatMetadataFlashcard from "@/components/chat/metadata/flashcard"
import ChatMetadataGoogle from "@/components/chat/metadata/google"
import ChatMetadataImage from "@/components/chat/metadata/image"
import ChatMetadataReferences from "@/components/chat/metadata/references"
import ChatMetadataSolveMath from "@/components/chat/metadata/solve-math"
import ChatMetadataWeather from "@/components/chat/metadata/weather"
import ChatMetadataWebsiteScraping from "@/components/chat/metadata/website-scraping"
import ChatMetadataWikipedia from "@/components/chat/metadata/wikipedia"
import ChatMetadataYoutube from "@/components/chat/metadata/youtube"

type Props = {
  metadata: ChatMessageMetadata[]
  contentIndex: number
}

export default function ChatMetadata({ metadata, contentIndex }: Props) {
  const currentMetadata = metadata[contentIndex]

  if (!currentMetadata) return null

  // Check if currentMetadata is an empty object
  if (!Object.keys(currentMetadata).length) {
    return null
  }

  // Check if the metadata is empty, e.g [{}]
  if (metadata.length === 1 && !Object.keys(metadata[0]).length) {
    return null
  }

  const {
    academic_search: academic,
    google_search: google,
    youtube_search: youtube,
    attachments: attachments,
    image_result: imageResults,
    source_documents: sourceDocuments,
    wiki_search_content: wikiSearchContent,
    wiki_feed_featured: wikiFeedFeatured,
    weather_information: weatherInformation,
    website_scraping: websiteScraping,
    solve_math: solveMath,
    flashcard: flashcard
  } = currentMetadata

  return (
    <div className="flex flex-col gap-6 pb-6">
      {attachments && <ChatMetadataAttachment metadata={attachments} />}
      {imageResults && <ChatMetadataImage metadata={imageResults} />}
      {weatherInformation && (
        <ChatMetadataWeather metadata={weatherInformation} />
      )}
      {google && <ChatMetadataGoogle metadata={google} />}
      {academic && <ChatMetadataAcademic metadata={academic} />}
      {youtube && <ChatMetadataYoutube metadata={youtube} />}
      {wikiSearchContent && (
        <ChatMetadataWikipedia metadata={wikiSearchContent} />
      )}
      {flashcard && <ChatMetadataFlashcard metadata={flashcard} />}
      {solveMath && <ChatMetadataSolveMath metadata={solveMath} />}
      {websiteScraping && (
        <ChatMetadataWebsiteScraping metadata={websiteScraping} />
      )}
      {sourceDocuments && <ChatMetadataReferences metadata={sourceDocuments} />}
    </div>
  )
}
