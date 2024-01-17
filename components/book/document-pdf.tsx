import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

import { memo, useCallback, useRef, useState, type Dispatch } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ViewportList } from "react-viewport-list"

import { cn } from "@/lib/utils"
import { IconSpinner } from "@/components/ui/icons"
import type { ActionDocument, StateDocument } from "@/components/book/document"

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
  pdfFile: string
  page: number | null
  pageRef: React.MutableRefObject<any>
  state: StateDocument
  dispatch: Dispatch<ActionDocument>
  className?: string
}

function BookDocumentPdf({
  pdfFile,
  page,
  pageRef,
  state,
  dispatch,
  className
}: Props) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <div ref={parentRef} className={cn("h-full overflow-hidden", className)}>
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        externalLinkTarget="_blank"
        className="relative h-full border-x bg-background"
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
              initialIndex={page ? page - 1 : 0}
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconSpinner className="animate-spin" />
                      </div>
                    }
                    className={cn(
                      "relative mb-4 flex min-h-full items-center justify-center border-y bg-background shadow-sm",
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
              <div className="absolute inset-0 flex items-center justify-center">
                <IconSpinner className="animate-spin" />
              </div>
            </div>
          </div>
        )}
      </Document>
    </div>
  )
}

export default memo(BookDocumentPdf)
