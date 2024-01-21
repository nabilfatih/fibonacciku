"use client"

import { useReducer } from "react"
import dynamic from "next/dynamic"
import {
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSearch
} from "@tabler/icons-react"

import { useMessage } from "@/lib/context/use-message"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { IconSeparator, IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

const ChatDocumentPdf = dynamic(
  () => import("@/components/chat/document-pdf"),
  {
    loading: () => <LoadingChatDocumentPdf />,
    ssr: false
  }
)

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

export default function ChatDocument() {
  const t = useScopedI18n("Chat")

  const { pageRef } = useMessage()

  const [state, dispatch] = useReducer(documentReducer, initialState, () => {
    return { ...initialState }
  })

  return (
    <div className="relative overflow-hidden py-2">
      <section className="h-full">
        <div className="flex h-full flex-col">
          <div className="rounded-t-xl border bg-background p-3">
            <div className="flex w-full items-center justify-between">
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
          </div>

          <ChatDocumentPdf state={state} dispatch={dispatch} />
        </div>
      </section>
    </div>
  )
}

function LoadingChatDocumentPdf() {
  return (
    <div className="h-full overflow-hidden">
      <div className="relative h-full border border-t-0 bg-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconSpinner className="animate-spin" />
        </div>
      </div>
    </div>
  )
}
