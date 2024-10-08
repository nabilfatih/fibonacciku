import { MessageContextProvider } from "@/lib/context/use-message"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="group w-full overflow-hidden pl-0 duration-300 ease-in-out animate-in">
        <MessageContextProvider>{children}</MessageContextProvider>
      </div>
    </div>
  )
}
