import { useCallback, useEffect, useRef, useState } from "react"
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react"
import markdownToTxt from "markdown-to-txt"
import { toast } from "sonner"

import { useScopedI18n } from "@/locales/client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

type Props = {
  text: string
}

export default function ChatMessageActionSpeech({ text }: Props) {
  const t = useScopedI18n("BackendRouter")
  const tForm = useScopedI18n("FormChat")
  const audioRef = useRef(new Audio())
  const controllerRef = useRef(new AbortController())
  const mediaSourceRef = useRef<MediaSource | null>(null)
  const sourceBufferRef = useRef<SourceBuffer | null>(null)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  // stop the audio if the component is unmounted
  useEffect(() => {
    return () => {
      audioRef.current.pause()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioRef.current.currentTime = 0
      controllerRef.current.abort()
    }
  }, [])

  const handleStreamError = useCallback((error: any) => {
    if (error.name === "AbortError") {
      // Stream was aborted
      return
    } else {
      toast.error(t("audio-not-supported"))
    }
    setIsPlaying(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setupMediaSource = async () => {
    const mediaSource = new MediaSource()
    mediaSourceRef.current = mediaSource
    audioRef.current.src = URL.createObjectURL(mediaSource)

    return new Promise<void>(resolve => {
      mediaSource.onsourceopen = () => {
        sourceBufferRef.current = mediaSource.addSourceBuffer("audio/mpeg")
        resolve()
      }
    })
  }

  const playSpeech = useCallback(async () => {
    if (isPlaying) {
      // Stop the audio if it's playing
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      controllerRef.current.abort() // Signal to abort the fetch request
      setIsPlaying(false)
    } else {
      // Reset the AbortController before starting a new request
      controllerRef.current = new AbortController()

      setIsPlaying(true)
      await setupMediaSource()

      try {
        const cleanText = markdownToTxt(text)
        const response = await fetch("/api/ai/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text: cleanText }),
          signal: controllerRef.current.signal // Abort the request if the button is clicked again before the response is received
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        if (!response.body) {
          return
        }

        const reader = response.body.getReader()
        const sourceBuffer = sourceBufferRef.current

        reader
          .read()
          .then(function process({ done, value }) {
            try {
              if (done) {
                if (mediaSourceRef.current) {
                  mediaSourceRef.current.endOfStream()
                }
                return
              }
              if (!sourceBuffer) return
              if (sourceBuffer.updating) {
                // If the sourceBuffer is updating, wait for it to complete
                sourceBuffer.addEventListener(
                  "updateend",
                  () => {
                    sourceBuffer.appendBuffer(value)
                  },
                  { once: true }
                )
              } else {
                sourceBuffer.appendBuffer(value)
              }
              sourceBuffer.onupdateend = () => {
                reader.read().then(process).catch(handleStreamError)
              }
            } catch (error: any) {
              handleStreamError(error)
            }
          })
          .catch(error => {
            handleStreamError(error)
          })

        // Directly play the audio in the click event handler
        audioRef.current
          .play()
          .then(() => {
            // Playback started successfully
            setIsPlaying(true)
          })
          .catch(error => {
            // Autoplay was prevented
            setIsPlaying(false)
            toast.error(t("audio-not-supported"))
            console.error("Playback was prevented:", error)
            // Show a message or button for the user to manually start playback
          })
        audioRef.current.onended = () => {
          setIsPlaying(false)
        }
      } catch (error) {
        handleStreamError(error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, text, handleStreamError])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={playSpeech}>
          {isPlaying ? (
            <IconPlayerStop className="h-4 w-4 animate-pulse" />
          ) : (
            <IconPlayerPlay className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isPlaying ? "Stop speech" : "Start speech"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isPlaying ? tForm("stop") : tForm("play")}</p>
      </TooltipContent>
    </Tooltip>
  )
}
