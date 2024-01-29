import { useEffect } from "react"
import type { DialogProps } from "@radix-ui/react-dialog"

import { useCurrentUser } from "@/lib/context/use-current-user"
import { useMessage } from "@/lib/context/use-message"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { capitalizeFirstLetter } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface ChatShareDialogProps extends DialogProps {}

export default function ChatSettingsDialog({ ...props }: ChatShareDialogProps) {
  const t = useScopedI18n("FormChat")

  const { userDetails } = useCurrentUser()
  const { state, dispatch } = useMessage()

  useEffect(() => {
    if (!userDetails) return
    if (!state.currentChat) {
      dispatch({
        type: "SET_GRADE",
        payload:
          userDetails.role === "professional" ? "professional" : "university"
      })
      return
    }
    if (state.currentChat.language) {
      dispatch({ type: "SET_LANGUAGE", payload: state.currentChat.language })
    }
    if (state.currentChat.grade) {
      dispatch({ type: "SET_GRADE", payload: state.currentChat.grade })
    }
  }, [dispatch, state.currentChat, userDetails])

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!userDetails) return null

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings")}</DialogTitle>
            <DialogDescription>{t("settings-desc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="language">{t("language")}</Label>
              <Select
                name="language"
                value={state.language}
                onValueChange={value =>
                  dispatch({
                    type: "SET_LANGUAGE",
                    payload: value.toLowerCase()
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("language")}>
                    {capitalizeFirstLetter(state.language)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("language")}</SelectLabel>
                    {LanguageOption.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {userDetails.role !== "professional" && (
              <div className="grid gap-2">
                <Label htmlFor="grade">{t("your-grade")}</Label>
                <Select
                  name="grade"
                  value={state.grade}
                  onValueChange={value =>
                    dispatch({
                      type: "SET_GRADE",
                      payload: value.toLowerCase()
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        userDetails.role === "teacher"
                          ? t("your-student-grade")
                          : t("your-grade")
                      }
                    >
                      {t(state.grade as never)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {userDetails.role === "teacher"
                          ? t("your-student-grade")
                          : t("your-grade")}
                      </SelectLabel>
                      {Class.map((item, index) => (
                        <SelectItem key={index} value={item.query}>
                          {t(item.name as never)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="items-center">
            <DialogClose asChild>
              <Button>{t("okay")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("settings")}</DrawerTitle>
          <DrawerDescription>{t("settings-desc")}</DrawerDescription>
        </DrawerHeader>

        <div className="grid gap-2 px-4">
          <div className="grid gap-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select
              name="language"
              value={state.language}
              onValueChange={value =>
                dispatch({ type: "SET_LANGUAGE", payload: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("language")}>
                  {state.language}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("language")}</SelectLabel>
                  {LanguageOption.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {userDetails.role !== "professional" && (
            <div className="grid gap-2">
              <Label htmlFor="grade">{t("grade")}</Label>
              <Select
                name="grade"
                value={state.grade}
                onValueChange={value =>
                  dispatch({ type: "SET_GRADE", payload: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      userDetails.role === "teacher"
                        ? t("your-student-grade")
                        : t("grade")
                    }
                  >
                    {t(state.grade as never)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {userDetails.role === "teacher"
                        ? t("your-student-grade")
                        : t("grade")}
                    </SelectLabel>
                    {Class.map((item, index) => (
                      <SelectItem key={index} value={item.query}>
                        {t(item.name as never)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button>{t("okay")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const LanguageOption = [
  "Auto Detect",
  "Acehnese",
  "Afrikaans",
  "Arabic",
  "Balinese",
  "Bengali",
  "Dutch",
  "English",
  "French",
  "Gayo",
  "German",
  "Greek",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Indonesian",
  "Italian",
  "Japanese",
  "Javanese",
  "Korean",
  "Latvian",
  "Malaysian",
  "Mandarin",
  "Marathi",
  "Nepali",
  "Norwegian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Russian",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tagalog",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Vietnamese",
  "Welsh"
]

const Class = [
  {
    name: "Kindergarten",
    query: "kindergarten"
  },
  {
    name: "Elementary",
    query: "elementary"
  },
  {
    name: "Middle School",
    query: "middle"
  },
  {
    name: "High School",
    query: "high"
  },
  {
    name: "University",
    query: "university"
  },
  {
    name: "Professional",
    query: "professional"
  }
]
