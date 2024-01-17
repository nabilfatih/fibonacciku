"use client"

import type { BookCollectionProps } from "@/components/book/collection"
import { useReducer, useRef } from "react"
import {
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSearch
} from "@tabler/icons-react"
import { IconSeparator } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useScopedI18n } from "@/locales/client"
import dynamic from "next/dynamic"

const BookDocumentPdf = dynamic(() => import("@/components/book/document-pdf"))

export type StateDocument = {
  zoom: number
  defaultZoom: number
  searchText: string
  currentPage: [number, number]
}

export type ActionDocument =
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_DEFAULT_ZOOM"; payload: number }
  | { type: "SET_SEARCH_TEXT"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: [number, number] }

const documentReducer = (state: StateDocument, action: ActionDocument) => {
  switch (action.type) {
    case "SET_ZOOM":
      return { ...state, zoom: action.payload }
    case "SET_DEFAULT_ZOOM":
      return { ...state, defaultZoom: action.payload }
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload }
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload }

    default:
      return state
  }
}

const initialState: StateDocument = {
  zoom: 1,
  defaultZoom: 1,
  searchText: "",
  currentPage: [1, 1]
}

export default function BookDocument({
  book,
  file,
  page
}: BookCollectionProps) {
  const pageRef = useRef<any>({})
  const t = useScopedI18n("Chat")

  const [state, dispatch] = useReducer(documentReducer, initialState, () => {
    return { ...initialState }
  })

  return (
    <>
      <header className="border-b h-16 flex items-center">
        <div className="grid grid-cols-5 items-center max-w-2xl px-4 mx-auto w-full">
          <div className="col-span-2 flex items-center gap-1">
            <Button
              name="zoom-out"
              title={t("zoom-out")}
              variant="ghost"
              size="icon"
              disabled={state.zoom <= 0.1}
              onClick={() => {
                if (state.zoom > 0.1)
                  dispatch({ type: "SET_ZOOM", payload: state.zoom - 0.1 })
              }}
            >
              <IconMinus className="h-4 w-4" />
              <span className="sr-only">{t("zoom-out")}</span>
            </Button>
            <Slider
              id="zoom"
              name="zoom"
              aria-label={t("zoom")}
              min={0.1}
              max={2}
              step={0.01}
              value={[state.zoom]}
              onValueChange={value => {
                dispatch({
                  type: "SET_ZOOM",
                  payload: value[0]
                })
              }}
            />
            <Button
              name="zoom-in"
              title={t("zoom-in")}
              variant="ghost"
              size="icon"
              disabled={state.zoom >= 2}
              onClick={() => {
                if (state.zoom < 2)
                  dispatch({ type: "SET_ZOOM", payload: state.zoom + 0.1 })
              }}
            >
              <IconPlus className="h-4 w-4" />
              <span className="sr-only">{t("zoom-in")}</span>
            </Button>
            <Button
              name="reset-zoom"
              title={t("reset")}
              variant="ghost"
              size="icon"
              onClick={() => {
                dispatch({
                  type: "SET_ZOOM",
                  payload: state.defaultZoom
                })
              }}
            >
              <IconRefresh className="h-4 w-4" />
              <span className="sr-only">{t("reset")}</span>
            </Button>
          </div>

          <div className="col-span-1 flex items-start justify-center">
            <div className="flex items-center">
              <Input
                type="text"
                min={1}
                max={state.currentPage[1]}
                value={state.currentPage[0]}
                onChange={e => {
                  // if not number, return
                  if (isNaN(parseInt(e.target.value))) return
                  const pageNumber = parseInt(e.target.value)
                  const main = pageRef.current
                  if (main && typeof main.scrollToIndex === "function") {
                    main.scrollToIndex({
                      index: pageNumber - 1,
                      alignToTop: true
                    })
                  }
                }}
                // remove the default browser styling
                className="hidden h-10 w-10 bg-transparent p-0 text-center text-sm text-muted-foreground sm:block"
              />
              <span className="text-sm text-muted-foreground sm:hidden">
                {state.currentPage[0]}
              </span>
              <IconSeparator className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {state.currentPage[1]}
              </span>
            </div>
          </div>

          <div className="col-span-2 w-full">
            <form className="relative">
              <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                tabIndex={-1} // Prevents the input from being focused when the user presses tab
                type="text"
                placeholder={t("search-text")}
                className="h-10 bg-background pl-10"
                value={state.searchText}
                autoFocus={false}
                autoComplete="off"
                autoCorrect="off"
                onChange={e => {
                  dispatch({
                    type: "SET_SEARCH_TEXT",
                    payload: e.target.value
                  })
                }}
              />
            </form>
          </div>
        </div>
      </header>

      <BookDocumentPdf
        pdfFile={file}
        page={page}
        pageRef={pageRef}
        state={state}
        dispatch={dispatch}
        className="h-[calc(100%-4rem)] max-w-2xl mx-auto sm:px-4 pb-16"
      />
    </>
  )
}
