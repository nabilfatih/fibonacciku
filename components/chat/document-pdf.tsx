import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import {
  type Dispatch,
  memo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { ViewportList } from "react-viewport-list";
import type { ActionDocument, StateDocument } from "@/components/chat/document";
import { useMessage } from "@/lib/context/use-message";
import { IconSpinner } from "@/components/ui/icons";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

function highlightPattern(text: string, pattern: string) {
  const replacement = `<mark class="bg-base-100 text-secondary">$&</mark>`;
  const regex = new RegExp(pattern, "g");
  return text.replace(regex, replacement);
}

type Props = {
  state: StateDocument;
  dispatch: Dispatch<ActionDocument>;
};

function ChatDocumentPdf({ state, dispatch }: Props) {
  const { state: stateMessage, pageRef } = useMessage();

  const parentRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [numPages, setNumPages] = useState<number>(-1);
  const [firstInit, setFirstInit] = useState<boolean>(true);

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, state.searchText),
    [state.searchText]
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setFirstInit(true);
    },
    []
  );

  const onPageLoad = useCallback(
    (page: any) => {
      if (parentRef.current) {
        const pageScale =
          parentRef.current.clientWidth / page.originalWidth - 0.02; // make sure the page is not x overflow
        if (firstInit) {
          dispatch({
            type: "SET_ZOOM",
            payload: pageScale,
          });
          dispatch({
            type: "SET_DEFAULT_ZOOM",
            payload: pageScale,
          });
          setFirstInit(false);
        }
      }
    },
    [dispatch, firstInit]
  );

  if (!stateMessage.currentDocument) {
    return (
      <div ref={parentRef} className="h-full overflow-hidden">
        <div className="relative h-full border border-t-0 bg-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <IconSpinner className="animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-full overflow-hidden">
      <Document
        file={stateMessage.currentDocument}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        externalLinkTarget="_blank"
        className="relative h-full border border-t-0 bg-background"
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
                page: i + 1,
              }))}
              initialIndex={stateMessage.initialPage - 1}
              onViewportIndexesChange={viewportIndexes => {
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: [viewportIndexes[0] + 1, numPages],
                });
              }}
            >
              {(item, index) => {
                return (
                  <Page
                    key={`page_${item.page}`}
                    pageNumber={item.page}
                    pageIndex={index}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    onLoadSuccess={onPageLoad}
                    scale={state.zoom}
                    customTextRenderer={textRenderer}
                    loading={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconSpinner className="animate-spin" />
                      </div>
                    }
                    className="relative mb-2 flex h-full items-center justify-center bg-background shadow-sm last:mb-0"
                  />
                );
              }}
            </ViewportList>
          </div>
        ) : (
          <div ref={listRef} className="scroll-gutter h-full overflow-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconSpinner className="animate-spin" />
            </div>
          </div>
        )}
      </Document>
    </div>
  );
}

export default memo(ChatDocumentPdf);
