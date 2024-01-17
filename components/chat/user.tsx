import { useMessage } from "@/lib/context/use-message"
import { useEffect, useRef } from "react"
import Textarea from "react-textarea-autosize"

type Props = {
  content: string
  messageIndex: number
}

export default function ChatUser({ content, messageIndex }: Props) {
  const { state, dispatch } = useMessage()

  const promptRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messageIndex === state.editMessageIndex && promptRef.current) {
      const textLength = promptRef.current.value.length
      promptRef.current.focus()
      promptRef.current.setSelectionRange(textLength, textLength)
    }
  }, [messageIndex, state.editMessageIndex])

  return (
    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
      {messageIndex === state.editMessageIndex ? (
        <Textarea
          ref={promptRef}
          className="m-0 min-w-full resize-none border-none bg-transparent p-0 outline-none ring-0 scrollbar-hide"
          value={state.editMessageContent}
          autoFocus
          autoCorrect="off"
          spellCheck={false}
          aria-autocomplete="none"
          onChange={e =>
            dispatch({
              type: "SET_EDIT_MESSAGE_CONTENT",
              payload: e.target.value
            })
          }
        />
      ) : (
        <div className="whitespace-pre-wrap">{content}</div>
      )}
    </div>
  )
}
