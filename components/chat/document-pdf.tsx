import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

import { memo, useCallback, useRef, useState, type Dispatch } from "react"
import { IconMoodSad } from "@tabler/icons-react"
import { Document, Page, pdfjs } from "react-pdf"
import { ViewportList } from "react-viewport-list"

import { useMessage } from "@/lib/context/use-message"
import { cn } from "@/lib/utils"

import { IconSpinner } from "@/components/ui/icons"
import type { ActionDocument, StateDocument } from "@/components/chat/document"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString()

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/"
}

function highlightPattern(text: string, pattern: string) {
  const replacement = `<mark class="bg-base-100 text-secondary">$&</mark>`
  const regex = new RegExp(pattern, "g")
  return text.replace(regex, replacement)
}

type Props = {
  state: StateDocument
  dispatch: Dispatch<ActionDocument>
}

function ChatDocumentPdf({ state, dispatch }: Props) {
  const { state: stateMessage, pageRef } = useMessage()

  const parentRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const [numPages, setNumPages] = useState<number>(-1)
  const [firstInit, setFirstInit] = useState<boolean>(true)

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, state.searchText),
    [state.searchText]
  )

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
      setFirstInit(true)
    },
    []
  )

  const onPageLoad = useCallback(
    (page: any) => {
      if (parentRef.current) {
        const pageScale =
          parentRef.current.clientWidth / page.originalWidth - 0.02 // make sure the page is not x overflow
        if (firstInit) {
          dispatch({
            type: "SET_ZOOM",
            payload: pageScale
          })
          dispatch({
            type: "SET_DEFAULT_ZOOM",
            payload: pageScale
          })
          setFirstInit(false)
        }
      }
    },
    [dispatch, firstInit]
  )

  if (!stateMessage.currentDocument) {
    return (
      <div ref={parentRef} className="h-full overflow-hidden">
        <div className="relative h-full border border-t-0 bg-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <IconSpinner className="animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="h-full overflow-hidden">
      <Document
        file={stateMessage.currentDocument}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        externalLinkTarget="_blank"
        className="relative h-full border border-t-0 bg-background"
        error={
          <div className="absolute inset-0 flex items-center justify-center">
            <IconMoodSad />
          </div>
        }
        loading={
          <div className="absolute inset-0 flex items-center justify-center">
            <IconSpinner className="animate-spin" />
          </div>
        }
      >
        {numPages !== -1 ? (
          <div ref={listRef} className="scroll-gutter h-full overflow-auto">
            <ViewportList
              ref={pageRef}
              viewportRef={listRef}
              items={Array.from({ length: numPages }, (_, i) => ({
                page: i + 1
              }))}
              initialIndex={stateMessage.initialPage - 1}
              onViewportIndexesChange={viewportIndexes => {
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: [viewportIndexes[0] + 1, numPages]
                })
              }}
            >
              {(item, index) => {
                return (
                  <Page
                    key={`page_${item.page}`}
                    pageNumber={item.page}
                    pageIndex={index}
                    onLoadSuccess={onPageLoad}
                    scale={state.zoom}
                    customTextRenderer={textRenderer}
                    loading={
                      <div
                        className="relative"
                        style={{
                          height: listRef.current?.clientHeight
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconSpinner className="animate-spin" />
                        </div>
                      </div>
                    }
                    className={cn(
                      "relative mb-4 flex h-fit min-h-full items-center justify-center border-y bg-background shadow-sm",
                      index === 0 && "mt-0 border-t-0",
                      // last index
                      index === numPages - 1 && "mb-0 border-b-0"
                    )}
                  />
                )
              }}
            </ViewportList>
          </div>
        ) : (
          <div ref={listRef} className="scroll-gutter h-full overflow-auto">
            <div className="relative mb-4 flex min-h-full items-center justify-center bg-background shadow-sm">
              <div
                className="relative"
                style={{
                  height: listRef.current?.clientHeight
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconSpinner className="animate-spin" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Document>
    </div>
  )
}

export default memo(ChatDocumentPdf)
