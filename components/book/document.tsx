"use client"

import { useReducer, useRef } from "react"
import dynamic from "next/dynamic"
import {
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSearch
} from "@tabler/icons-react"

import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { IconSeparator } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import type { BookReadProps } from "@/components/book/read"

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

export default function BookDocument({ book, file, page }: BookReadProps) {
  const pageRef = useRef<any>({})
  const t = useScopedI18n("Chat")

  const [state, dispatch] = useReducer(documentReducer, initialState, () => {
    return { ...initialState }
  })

  return (
    <>
      <header className="flex h-16 items-center border-b">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <Button
              name="zoom-out"
              title={t("zoom-out")}
              variant="outline"
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
            <p className="mx-1 text-sm text-muted-foreground">
              {Math.round(state.zoom * 100)}%
            </p>
            <Button
              name="zoom-in"
              title={t("zoom-in")}
              variant="outline"
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
              variant="outline"
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-0.5">
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
                className="h-9 w-9 bg-transparent p-0 text-center text-sm text-muted-foreground"
              />
              <IconSeparator className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {state.currentPage[1]}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  name="search"
                  title={t("search-text")}
                  variant="outline"
                  size="icon"
                >
                  <IconSearch className="h-5 w-5" />
                  <span className="sr-only">{t("search-text")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-1">
                <form className="relative">
                  <IconSearch className="absolute left-1.5 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    tabIndex={-1} // Prevents the input from being focused when the user presses tab
                    type="text"
                    placeholder={t("search-text")}
                    className="h-10 border-0 bg-background pl-8 outline-none !ring-0"
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <BookDocumentPdf
        pdfFile={file}
        page={page}
        pageRef={pageRef}
        state={state}
        dispatch={dispatch}
        className="mx-auto h-[calc(100%-4rem)] max-w-2xl pb-16 sm:px-4 lg:pb-[69px]"
      />
    </>
  )
}
